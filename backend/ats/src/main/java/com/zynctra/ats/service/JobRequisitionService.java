package com.zynctra.ats.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zynctra.ats.dto.JobRequisitionRequest;
import com.zynctra.ats.entity.JobRequisition;
import com.zynctra.ats.repository.JobRequisitionRepository;
import com.zynctra.ats.security.TenantAuthenticationToken;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobRequisitionService {

    private final JobRequisitionRepository jobRepository;

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public JobRequisition createJob(JobRequisitionRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        JobRequisition job = JobRequisition.builder()
            .tenantId(tenantId)
            .organizationId(auth.getTenantId())
            .title(request.getTitle())
            .description(request.getDescription())
            .requirements(request.getRequirements())
            .responsibilities(request.getResponsibilities())
            .departmentId(request.getDepartmentId())
            .hiringManagerId(request.getHiringManagerId())
            .status(JobRequisition.JobStatus.DRAFT)
            .employmentType(request.getEmploymentType())
            .experienceLevel(request.getExperienceLevel())
            .minSalary(request.getMinSalary())
            .maxSalary(request.getMaxSalary())
            .currency(request.getCurrency())
            .location(request.getLocation())
            .remoteAllowed(request.getRemoteAllowed() != null ? request.getRemoteAllowed() : false)
            .targetStartDate(request.getTargetStartDate())
            .openingsCount(request.getOpeningsCount())
            .filledCount(0)
            .createdBy(userId)
            .build();

        JobRequisition saved = jobRepository.save(job);
        log.info("Created job requisition: {} for tenant: {}", saved.getId(), tenantId);
        return saved;
    }

    @Transactional(readOnly = true)
    public JobRequisition getJob(UUID jobId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return jobRepository.findById(jobId)
            .filter(j -> j.getTenantId().equals(auth.getTenantId()))
            .filter(j -> j.getDeletedAt() == null)
            .orElseThrow(() -> new EntityNotFoundException("Job not found: " + jobId));
    }

    @Transactional(readOnly = true)
    public Page<JobRequisition> listJobs(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return jobRepository.findByTenantIdAndDeletedAtIsNull(auth.getTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<JobRequisition> listJobsByStatus(JobRequisition.JobStatus status, Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return jobRepository.findByTenantIdAndStatusAndDeletedAtIsNull(auth.getTenantId(), status, pageable);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public JobRequisition updateJob(UUID jobId, JobRequisitionRequest request) {
        JobRequisition job = getJob(jobId);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setDepartmentId(request.getDepartmentId());
        job.setHiringManagerId(request.getHiringManagerId());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setCurrency(request.getCurrency());
        job.setLocation(request.getLocation());
        job.setRemoteAllowed(request.getRemoteAllowed() != null ? request.getRemoteAllowed() : false);
        job.setTargetStartDate(request.getTargetStartDate());
        job.setOpeningsCount(request.getOpeningsCount());

        return jobRepository.save(job);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public JobRequisition publishJob(UUID jobId) {
        JobRequisition job = getJob(jobId);
        job.setStatus(JobRequisition.JobStatus.OPEN);
        job.setPostedAt(Instant.now());
        return jobRepository.save(job);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public JobRequisition closeJob(UUID jobId) {
        JobRequisition job = getJob(jobId);
        job.setStatus(JobRequisition.JobStatus.CLOSED);
        job.setClosedAt(Instant.now());
        return jobRepository.save(job);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void deleteJob(UUID jobId) {
        JobRequisition job = getJob(jobId);
        job.setDeletedAt(Instant.now());
        jobRepository.save(job);
        log.info("Deleted job requisition: {}", jobId);
    }

    @Transactional(readOnly = true)
    public List<JobRequisition> searchJobs(String query) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return jobRepository.searchByTitleOrDescription(auth.getTenantId(), query);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}