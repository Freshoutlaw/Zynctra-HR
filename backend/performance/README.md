
Zynctra Performance Service — Security-Hardened Module
Overview
The Performance Management microservice handles employee performance reviews, goal tracking, and competency management with enterprise-grade security controls.
Security Architecture
Zero-Trust Principles Implemented
Table
Layer	Control	Implementation
Authentication	JWT validation	JwtAuthenticationFilter — signature + expiration + claim validation
Authorization	RBAC	@PreAuthorize on all service methods
Tenant Isolation	Row-level security	SecureBaseEntity + Hibernate @Filter + manual query validation
Input Validation	Whitelist approach	Jakarta @Valid + regex patterns + length limits on all fields
Rate Limiting	In-process	Resilience4j — 20 writes/min, 100 reads/min per IP
Audit Logging	AOP-based	AuditAspect — all @Audited methods logged with masked user IDs
SQL Injection Prevention	Parameterized queries	Spring Data JPA — no native queries, no dynamic SQL
DoS Prevention	Resource limits	Bounded text fields, max goals per employee, JVM/container limits
File Structure
plain
backend/performance/
├── pom.xml                                    # Security-enhanced dependencies
├── Dockerfile                                 # Multi-stage, non-root, read-only
├── docker-compose.performance.yml             # Container security hardening
├── src/main/
│   ├── java/com/zynctra/performance/
│   │   ├── PerformanceApplication.java        # Main app with security validation
│   │   ├── config/
│   │   │   ├── SecurityConfig.java            # Stateless JWT, CORS, headers
│   │   │   ├── RateLimitConfig.java           # Resilience4j rate limiters
│   │   │   └── AuditConfig.java               # AOP audit enablement
│   │   ├── controller/
│   │   │   └── PerformanceController.java       # REST endpoints with validation
│   │   ├── dto/
│   │   │   ├── PerformanceReviewDTO.java        # Validated input DTO
│   │   │   ├── GoalDTO.java                   # Validated input DTO
│   │   │   └── FeedbackDTO.java               # Validated input DTO
│   │   ├── entity/
│   │   │   ├── SecureBaseEntity.java            # Multi-tenant audit base
│   │   │   ├── PerformanceReview.java           # Review entity with state machine
│   │   │   ├── Goal.java                      # Goal entity with progress bounds
│   │   │   └── Competency.java                # Competency framework entity
│   │   ├── repository/
│   │   │   ├── PerformanceReviewRepository.java # Tenant-scoped queries
│   │   │   └── GoalRepository.java            # Tenant-scoped queries
│   │   ├── service/
│   │   │   ├── PerformanceReviewService.java    # Business logic + RBAC
│   │   │   └── GoalService.java               # Business logic + RBAC
│   │   └── security/
│   │       ├── TenantContext.java             # Thread-local tenant with validation
│   │       ├── JwtAuthenticationFilter.java   # JWT validation filter
│   │       ├── AuditAspect.java               # Security audit logging
│   │       ├── Audited.java                   # Audit annotation
│   │       └── TenantFilterInterceptor.java   # Hibernate interceptor backup
│   └── resources/
│       └── application.yml                    # Security-hardened config
Key Security Features
1. Input Hardening
All user input is validated through multiple layers:
DTO Layer: Jakarta @NotBlank, @Size, @Pattern annotations
Entity Layer: Setter validation with regex whitelists
Controller Layer: @Valid annotation triggers DTO validation
Service Layer: Business rule validation (state machine, authorization)
Example — Rejected Inputs:
plain
Title: "<script>alert('xss')</script>"     → Pattern mismatch, rejected
Description: 5001 'A' characters            → Size limit, rejected
Employee ID: "'; DROP TABLE users; --"     → Pattern mismatch, rejected
Progress: 101                              → @Max(100), rejected
2. Tenant Isolation
Every database query includes tenant_id filtering:
java
// Hibernate @Filter on SecureBaseEntity
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")

// Repository queries enforce tenant
@Query("SELECT r FROM PerformanceReview r WHERE r.id = :id AND r.tenantId = :tenantId AND r.deleted = false")
Anti-tampering: tenantId is set from JWT claims in TenantContext, never from user input.
3. Rate Limiting
yaml
# Resilience4j configuration
resilience4j:
  ratelimiter:
    instances:
      performance-strict:    # POST/PUT/DELETE
        limitForPeriod: 20
        limitRefreshPeriod: 1m
      performance-standard:  # GET
        limitForPeriod: 100
        limitRefreshPeriod: 1m
4. Audit Logging
All security-relevant operations are logged:
plain
AUDIT|action=ENTER|user=abc****yz|tenant=tenant_001|method=createReview|timestamp=2026-06-12T10:30:00Z
AUDIT|action=SUCCESS|user=abc****yz|method=createReview|timestamp=2026-06-12T10:30:01Z
AUDIT|action=FAILURE|user=abc****yz|method=submitReview|exception=SecurityException|timestamp=2026-06-12T10:31:00Z
Security: User IDs are masked in logs. No sensitive content logged.
5. Container Hardening
dockerfile
# Non-root user
USER zynctra

# Read-only filesystem
read_only: true

# No new privileges
security_opt:
  - no-new-privileges:true

# Drop all capabilities
cap_drop:
  - ALL
API Endpoints
Performance Reviews
Table
Method	Endpoint	Auth Required	Rate Limit
POST	/api/performance/reviews	MANAGER+	20/min
GET	/api/performance/reviews/{id}	EMPLOYEE+	100/min
POST	/api/performance/reviews/{id}/submit	MANAGER+	20/min
POST	/api/performance/reviews/{id}/acknowledge	EMPLOYEE	20/min
GET	/api/performance/employees/{id}/reviews	Self/Manager+	100/min
GET	/api/performance/admin/overdue-reviews	ADMIN	100/min
DELETE	/api/performance/reviews/{id}	ADMIN	20/min
Goals
Table
Method	Endpoint	Auth Required	Rate Limit
POST	/api/performance/goals	EMPLOYEE+	20/min
GET	/api/performance/goals/{id}	EMPLOYEE+	100/min
PATCH	/api/performance/goals/{id}/progress	EMPLOYEE+	20/min
GET	/api/performance/employees/{id}/goals	Self/Manager+	100/min
GET	/api/performance/admin/overdue-goals	ADMIN	100/min
DELETE	/api/performance/goals/{id}	MANAGER+	20/min
Database Schema (PostgreSQL)
sql
-- Least-privilege user
CREATE USER performance_app WITH PASSWORD '...';
GRANT CONNECT ON DATABASE zynctra TO performance_app;
GRANT USAGE ON SCHEMA performance_schema TO performance_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA performance_schema TO performance_app;
REVOKE DELETE ON ALL TABLES IN SCHEMA performance_schema FROM performance_app;

-- Schema
CREATE SCHEMA performance_schema;

-- Performance Reviews
CREATE TABLE performance_schema.performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    reviewer_id VARCHAR(64) NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    strengths TEXT,
    areas_for_improvement TEXT,
    goals TEXT,
    reviewer_comments TEXT,
    employee_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_at TIMESTAMP,
    submitted_at TIMESTAMP,
    finalized_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_period CHECK (review_period_end >= review_period_start)
);

-- Goals
CREATE TABLE performance_schema.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    due_date DATE NOT NULL,
    completed_at TIMESTAMP,
    weight DECIMAL(3,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_reviews_employee_tenant ON performance_schema.performance_reviews(employee_id, tenant_id);
CREATE INDEX idx_reviews_period ON performance_schema.performance_reviews(review_period_start, review_period_end);
CREATE INDEX idx_reviews_status ON performance_schema.performance_reviews(status, tenant_id);
CREATE INDEX idx_goals_employee ON performance_schema.goals(employee_id, tenant_id);
CREATE INDEX idx_goals_status ON performance_schema.goals(status, due_date);
Environment Variables
Table
Variable	Required	Description
DB_URL	Yes	PostgreSQL JDBC URL
DB_USER	Yes	Database username (least-privilege)
DB_PASSWORD	Yes	Database password (from secret)
JWT_SECRET	Yes	JWT signing secret (32+ bytes)
SPRING_PROFILES_ACTIVE	No	prod for production
Deployment
bash
# Build
./mvnw clean package -DskipTests

# Docker build
docker build -t zynctra/performance-service:latest .

# Run with Docker Compose
docker-compose -f docker-compose.performance.yml up -d

# Verify health
curl http://localhost:8083/api/performance/actuator/health
Security Checklist
[x] All endpoints require authentication
[x] RBAC enforced at method level
[x] Input validation on all fields (whitelist approach)
[x] SQL injection prevention (JPA parameterized queries)
[x] Tenant isolation (Hibernate filter + query validation)
[x] Rate limiting (Resilience4j)
[x] Audit logging (AOP-based, no sensitive data)
[x] Soft delete only (no physical deletion)
[x] Non-root Docker container
[x] Read-only filesystem
[x] No new privileges
[x] Secrets externalized (env vars / Docker secrets)
[x] Health checks configured
[x] Resource limits set
[x] CORS strictly limited
[x] Security headers (CSP, X-Frame-Options, XSS)
[x] Stateless session management
Next Steps for Full Security Hardening
Integrate with shared security module (com.zynctra.common.security)
Add field-level encryption for sensitive review comments (optional)
Implement API versioning for backward compatibility
Add distributed tracing (OpenTelemetry) for security event correlation
Configure WAF rules at the API gateway level