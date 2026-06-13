package com.zynctra.performance.service;

import com.zynctra.performance.dto.GoalDTO;
import com.zynctra.performance.entity.Goal;
import com.zynctra.performance.repository.GoalRepository;
import com.zynctra.performance.security.Audited;
import com.zynctra.performance.security.TenantContext;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@Service
@Validated
@Transactional(readOnly = true)
public class GoalService {

    private final GoalRepository goalRepository;
    private final RateLimiter strictRateLimiter;

    public GoalService(GoalRepository goalRepository,
                        @Qualifier("strictRateLimiter") RateLimiter strictRateLimiter) {
        this.goalRepository = goalRepository;
        this.strictRateLimiter = strictRateLimiter;
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    @Transactional
    public Goal createGoal(@Valid GoalDTO dto, String createdBy) {
        try {
            strictRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded");
        }

        // Limit active goals per employee (DoS prevention)
        String tenantId = TenantContext.getCurrentTenant();
        long activeCount = goalRepository.countActiveGoalsByEmployee(dto.getEmployeeId(), tenantId);
        if (activeCount >= 20) {
            throw new IllegalStateException("Maximum active goals (20) reached for this employee");
        }

        Double weight = dto.getWeightPercent() != null ? dto.getWeightPercent() / 100.0 : null;

        Goal goal = Goal.create(
            dto.getEmployeeId(),
            dto.getTitle(),
            dto.getDescription(),
            dto.getDueDate(),
            weight,
            createdBy
        );

        return goalRepository.save(goal);
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public Goal getGoal(String id) {
        String tenantId = TenantContext.getCurrentTenant();
        return goalRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Goal not found"));
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    @Transactional
    public Goal updateProgress(String id, Integer progressPercent, String updatedBy) {
        String tenantId = TenantContext.getCurrentTenant();
        
        Goal goal = goalRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Goal not found"));

        // Authorization: employee can update own goals, managers can update subordinates'
        if (!goal.getEmployeeId().equals(updatedBy) && !isManagerOf(updatedBy, goal.getEmployeeId())) {
            throw new SecurityException("Not authorized to update this goal");
        }

        goal.setProgressPercent(progressPercent);
        goal.setUpdatedBy(updatedBy);
        
        return goalRepository.save(goal);
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public List<Goal> getEmployeeGoals(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return goalRepository.findByEmployeeId(employeeId, tenantId);
    }

    @Audited
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    public List<Goal> getOverdueGoals() {
        String tenantId = TenantContext.getCurrentTenant();
        return goalRepository.findOverdueGoals(LocalDate.now(), tenantId);
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN')")
    @Transactional
    public void deleteGoal(String id, String deletedBy) {
        String tenantId = TenantContext.getCurrentTenant();
        int updated = goalRepository.softDeleteById(id, tenantId, deletedBy);
        if (updated == 0) {
            throw new jakarta.persistence.EntityNotFoundException("Goal not found or access denied");
        }
    }

    private boolean isManagerOf(String managerId, String employeeId) {
        // Delegate to HR service or check manager-subordinate relationship
        // Placeholder: implement via HR service call
        return false;
    }
}