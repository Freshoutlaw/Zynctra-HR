package com.zynctra.ats.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zynctra.ats.dto.ApplicationRequest;
import com.zynctra.ats.dto.PipelineUpdateRequest;
import com.zynctra.ats.entity.Application;
import com.zynctra.ats.entity.Candidate;
import com.zynctra.ats.entity.JobRequisition;
import com.zynctra.ats.repository.ApplicationRepository;
import com.zynctra.ats.repository.CandidateRepository;
import com.zynctra.ats.repository.JobRequisitionRepository;
import com.zynctra.ats.security.TenantAuthenticationToken;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobRequisitionRepository jobRepository;

    @Transactional
    public Application submitApplication(ApplicationRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();

        JobRequisition job = jobRepository.findById(request.getJobRequisitionId())
            .filter(j -> j.getTenantId().equals(tenantId))
            .filter(j -> j.getDeletedAt() == null)
            .orElseThrow(() -> new EntityNotFoundException("Job not found: " + request.getJobRequisitionId()));

        if (job.getStatus() != JobRequisition.JobStatus.OPEN) {
            throw new IllegalStateException("Job is not open for applications");
        }

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
            .filter(c -> c.getTenantId().equals(tenantId))
            .filter(c -> c.getDeletedAt() == null)
            .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + request.getCandidateId()));

        // Check for existing active application
        boolean hasExisting = applicationRepository
            .findByTenantIdAndCandidateIdAndDeletedAtIsNull(tenantId, candidate.getId(), Pageable.unpaged())
            .getContent()
            .stream()
            .anyMatch(a -> a.getJobRequisitionId().equals(job.getId()) && a.getStatus() == Application.ApplicationStatus.ACTIVE);

        if (hasExisting) {
            throw new IllegalStateException("Candidate already has an active application for this job");
        }

        Application application = Application.builder()
            .organizationId(tenantId)
            .jobRequisitionId(job.getId())
            .candidateId(candidate.getId())
            .status(Application.ApplicationStatus.ACTIVE)
            .stage(Application.PipelineStage.NEW)
            .appliedAt(Instant.now())
            .source(request.getSource() != null ? request.getSource() : candidate.getSource())
            .referrerId(request.getReferrerId())
            .coverLetter(request.getCoverLetter())
            .resumeVersion(request.getResumeVersion())
            .isInternal(request.getIsInternal() != null ? request.getIsInternal() : false)
            .previousApplicationId(request.getPreviousApplicationId())
            .build();
        application.setTenantId(tenantId);

        Application saved = applicationRepository.save(application);
        log.info("Submitted application: {} for job: {}", saved.getId(), job.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public Application getApplication(UUID applicationId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return applicationRepository.findByIdAndTenantIdAndDeletedAtIsNull(applicationId, auth.getTenantId())
            .orElseThrow(() -> new EntityNotFoundException("Application not found: " + applicationId));
    }

    @Transactional(readOnly = true)
    public Page<Application> listApplications(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return applicationRepository.findByTenantIdAndDeletedAtIsNull(auth.getTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Application> listApplicationsByJob(UUID jobId, Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return applicationRepository.findByTenantIdAndJobRequisitionIdAndDeletedAtIsNull(auth.getTenantId(), jobId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Application> listApplicationsByStage(Application.PipelineStage stage, Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return applicationRepository.findByTenantIdAndStageAndDeletedAtIsNull(auth.getTenantId(), stage, pageable);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Application movePipelineStage(UUID applicationId, PipelineUpdateRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        Application application = getApplication(applicationId);
        application.setStage(request.getNewStage());

        if (request.getNewStage() == Application.PipelineStage.REJECTED) {
            application.setStatus(Application.ApplicationStatus.REJECTED);
            application.setDispositionReason(request.getDispositionReason());
            application.setDispositionNotes(request.getDispositionNotes());
            application.setDispositionedAt(Instant.now());
            application.setDispositionedBy(userId);
        } else if (request.getNewStage() == Application.PipelineStage.HIRED) {
            application.setStatus(Application.ApplicationStatus.HIRED);
        }

        Application saved = applicationRepository.save(application);
        log.info("Moved application: {} to stage: {}", applicationId, request.getNewStage());
        return saved;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Application withdrawApplication(UUID applicationId) {
        Application application = getApplication(applicationId);
        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        application.setDispositionedAt(Instant.now());
        return applicationRepository.save(application);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void deleteApplication(UUID applicationId) {
        Application application = getApplication(applicationId);
        application.setDeletedAt(Instant.now());
        applicationRepository.save(application);
        log.info("Deleted application: {}", applicationId);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
