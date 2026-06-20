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

import com.zynctra.ats.dto.InterviewFeedbackRequest;
import com.zynctra.ats.dto.InterviewRequest;
import com.zynctra.ats.entity.Application;
import com.zynctra.ats.entity.Interview;
import com.zynctra.ats.repository.ApplicationRepository;
import com.zynctra.ats.repository.InterviewRepository;
import com.zynctra.ats.security.TenantAuthenticationToken;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Interview scheduleInterview(InterviewRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        Application application = applicationRepository.findByIdAndTenantIdAndDeletedAtIsNull(
            request.getApplicationId(), tenantId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        if (application.getStatus() != Application.ApplicationStatus.ACTIVE) {
            throw new IllegalStateException("Cannot schedule interview for inactive application");
        }

        Interview interview = Interview.builder()
            .organizationId(tenantId)
            .applicationId(application.getId())
            .interviewerId(request.getInterviewerId())
            .scheduledAt(request.getScheduledAt())
            .durationMinutes(request.getDurationMinutes())
            .type(request.getType())
            .status(Interview.InterviewStatus.SCHEDULED)
            .location(request.getLocation())
            .meetingLink(request.getMeetingLink())
            .createdBy(userId)
            .build();
        interview.setTenantId(tenantId);

        Interview saved = interviewRepository.save(interview);
        log.info("Scheduled interview: {} for application: {}", saved.getId(), application.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public Interview getInterview(UUID interviewId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return interviewRepository.findByIdAndTenantIdAndDeletedAtIsNull(interviewId, auth.getTenantId())
            .orElseThrow(() -> new EntityNotFoundException("Interview not found: " + interviewId));
    }

    @Transactional(readOnly = true)
    public Page<Interview> listInterviews(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return interviewRepository.findByTenantIdAndDeletedAtIsNull(auth.getTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    public List<Interview> listInterviewsByApplication(UUID applicationId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return interviewRepository.findByTenantIdAndApplicationIdAndDeletedAtIsNull(
            auth.getTenantId(), applicationId);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Interview submitFeedback(UUID interviewId, InterviewFeedbackRequest request) {
        Interview interview = getInterview(interviewId);

        interview.setRating(request.getRating());
        interview.setFeedback(request.getFeedback());
        interview.setRecommendation(request.getRecommendation());
        interview.setStrengths(request.getStrengths());
        interview.setWeaknesses(request.getWeaknesses());
        interview.setTechnicalScore(request.getTechnicalScore());
        interview.setCommunicationScore(request.getCommunicationScore());
        interview.setCultureFitScore(request.getCultureFitScore());
        interview.setStatus(Interview.InterviewStatus.COMPLETED);
        interview.setCompletedAt(Instant.now());

        Interview saved = interviewRepository.save(interview);
        log.info("Submitted feedback for interview: {}", interviewId);
        return saved;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Interview cancelInterview(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        interview.setStatus(Interview.InterviewStatus.CANCELLED);
        return interviewRepository.save(interview);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Interview markNoShow(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        interview.setStatus(Interview.InterviewStatus.NO_SHOW);
        return interviewRepository.save(interview);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void deleteInterview(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        interview.setDeletedAt(Instant.now());
        interviewRepository.save(interview);
        log.info("Deleted interview: {}", interviewId);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
