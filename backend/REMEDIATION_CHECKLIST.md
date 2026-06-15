# ZYNCTRA BACKEND - DETAILED REMEDIATION CHECKLIST

**Status:** 🛑 CRITICAL BUILD FAILURES  
**Total Issues:** 54 (8 CRITICAL, 12 HIGH, 15 MEDIUM, 7 LOW)

---

## PRIORITY 1: CRITICAL BLOCKERS (MUST FIX TODAY)

### ✗ Issue #1: common-lib/pom.xml Completely Malformed

**Severity:** 🔴 CRITICAL (Blocks all compilation)  
**File:** `backend/common-lib/pom.xml`  
**Problem:** File contains only fragment - missing XML declaration and root `<project>` element  
**Evidence:** Maven error: `Non-parseable POM: Expected root element 'project' but found 'properties'`

**Current File Content:**
```xml
<!-- pom.xml additions for security hardening -->
<properties>
    <java.version>17</java.version>
    ...
</properties>
<dependencies>
    ...
</dependencies>
```

**Required Fix:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.zynctra</groupId>
    <artifactId>common-lib</artifactId>
    <version>1.0.0</version>
    <name>Zynctra Common Library</name>
    <description>Shared utilities, models, and configuration for Zynctra backend</description>
    <packaging>jar</packaging>

    <!-- Insert: ALL content from current broken file -->
    <!-- Then add: </project> closing tag -->
</project>
```

**Affected Services:** auth, core-hr, payroll, time-attendance, benefits, analytics, performance, ats, learning, security-admin  
**Effort:** 30 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #2: payroll/pom.xml Double Opening Bracket

**Severity:** 🔴 CRITICAL (Blocks payroll service)  
**File:** `backend/payroll/pom.xml`  
**Problem:** Line 2 has `<<project` instead of `<project`  
**Maven Error:** `expected start tag name and not <`

**Fix:**
```xml
<!-- Line 2 BEFORE: -->
<<project xmlns="http://maven.apache.org/POM/4.0.0"

<!-- Line 2 AFTER: -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
```

**Effort:** 2 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #3: learning/pom.xml Double Opening Bracket

**Severity:** 🔴 CRITICAL (Blocks learning service)  
**File:** `backend/learning/pom.xml`  
**Problem:** Line 2 has `<<project` instead of `<project`  

**Fix:** Same as Issue #2

**Effort:** 2 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #4: security-admin/pom.xml Double Opening Bracket

**Severity:** 🔴 CRITICAL (Blocks security-admin service)  
**File:** `backend/security-admin/pom.xml`  
**Problem:** Line 2 has `<<project` instead of `<project`  

**Fix:** Same as Issue #2

**Effort:** 2 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #5: Hardcoded JWT Secret Allows Authentication Bypass

**Severity:** 🔴 CRITICAL (Security vulnerability)  
**Files:** 
- `backend/api-gateway/src/main/resources/application.yml`
- `backend/auth-service/src/main/resources/application.yml`
- `docker-compose.yml`

**Current Code:**
```yaml
security:
  jwt:
    secret: ${JWT_SECRET:mysupersecretsecurekey123456789012345678901234567890}
```

**Problem:** Default secret is hardcoded; anyone with source code can forge JWT tokens

**Fix:**
1. Generate secure secret:
```bash
openssl rand -base64 32
# Output example: "X1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R="
```

2. Update docker-compose.yml:
```yaml
api-gateway:
  environment:
    JWT_SECRET: "X1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R="
    
auth-service:
  environment:
    JWT_SECRET: "X1Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R="
```

3. Remove defaults from YAML files (or keep unsafe defaults with explicit warning)

**Effort:** 15 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #6: Redis Service Not in docker-compose.yml

**Severity:** 🔴 CRITICAL (Services crash at startup)  
**Problem:** Multiple services require Redis but it's not defined  

**Affected Services:**
- time-attendance
- security-admin  
- analytics-service

**Fix:** Add to `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: zynctra-redis
  ports:
    - "6379:6379"
  environment:
    - REDIS_PASSWORD=${REDIS_PASSWORD:-}
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  redis_data:
```

**Effort:** 5 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #7: RabbitMQ Service Not in docker-compose.yml

**Severity:** 🔴 CRITICAL (ATS service crashes)  
**Problem:** ATS service requires RabbitMQ but it's not defined  

**Fix:** Add to `docker-compose.yml`:

```yaml
rabbitmq:
  image: rabbitmq:3.12-management-alpine
  container_name: zynctra-rabbitmq
  ports:
    - "5672:5672"
    - "15672:15672"
  environment:
    RABBITMQ_DEFAULT_USER: ${RABBITMQ_USERNAME:-guest}
    RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-guest}
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq
  healthcheck:
    test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  rabbitmq_data:
```

**Effort:** 5 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #8: Port 8083 Conflict (ATS + Benefits)

**Severity:** 🔴 CRITICAL (One service cannot start)  
**Problem:** Both `ats` and `benefits` services configured for port 8083  

**Current Config:**
```yaml
# ats/application.yml
server:
  port: 8083

# benefits/application.yml  
server:
  port: 8083
```

**Fix:** Change benefits to different port:

**File:** `backend/benefits/src/main/resources/application.yml`

Change:
```yaml
server:
  port: 8083
```

To:
```yaml
server:
  port: 8086
```

**Also update docker-compose.yml if needed**

**Effort:** 3 minutes  
**Status:** [ ] NOT STARTED  

---

### ✗ Issue #9: Missing CORS_ALLOWED_ORIGINS Environment Variable

**Severity:** 🔴 CRITICAL (API Gateway fails to start)  
**Files:** `docker-compose.yml` api-gateway service  
**Problem:** Gateway CORS config references undefined environment variable

**Current Config:**
```yaml
# api-gateway/application.yml
allowedOrigins: "${CORS_ALLOWED_ORIGINS}"
```

**Fix:** Add environment variable to docker-compose:

```yaml
api-gateway:
  environment:
    CORS_ALLOWED_ORIGINS: "http://localhost:3000,http://localhost:3001,http://localhost:5173"
```

**Effort:** 2 minutes  
**Status:** [ ] NOT STARTED  

---

---

## PRIORITY 2: HIGH-RISK ISSUES (Fix This Week)

### ⚠️ Issue #10: Benefits Service Missing Database Migration Files

**Severity:** 🟠 HIGH (Database initialization fails)  
**File:** `backend/benefits/src/main/resources/db/migration/` (EMPTY)  
**Problem:** Flyway configured but no V1 migration exists

**Config:**
```yaml
# benefits/application.yml
spring:
  flyway:
    enabled: true
```

**Fix:** Create `V1__init_benefits.sql`:

```sql
-- ============================================
-- Zynctra Benefits Schema
-- ============================================

CREATE TABLE IF NOT EXISTS benefit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    plan_type VARCHAR(50) NOT NULL,
    premium_amount NUMERIC(15, 2),
    coverage_percentage INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false,
    
    CONSTRAINT uk_plan_tenant UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    plan_id UUID NOT NULL,
    enrollment_date DATE NOT NULL,
    coverage_start_date DATE,
    coverage_end_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false,
    
    FOREIGN KEY (plan_id) REFERENCES benefit_plans(id),
    CONSTRAINT uk_enrollment UNIQUE (tenant_id, employee_id, plan_id, enrollment_date)
);

CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    enrollment_id UUID NOT NULL,
    claim_amount NUMERIC(15, 2) NOT NULL,
    claim_date DATE NOT NULL,
    claim_status VARCHAR(50) DEFAULT 'SUBMITTED',
    approved_amount NUMERIC(15, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false,
    
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE TABLE IF NOT EXISTS dependents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    enrollment_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false,
    
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE INDEX idx_benefit_plans_tenant ON benefit_plans(tenant_id) WHERE deleted = false;
CREATE INDEX idx_enrollments_employee ON enrollments(tenant_id, employee_id) WHERE deleted = false;
CREATE INDEX idx_enrollments_plan ON enrollments(plan_id) WHERE deleted = false;
CREATE INDEX idx_claims_enrollment ON claims(enrollment_id) WHERE deleted = false;
CREATE INDEX idx_dependents_enrollment ON dependents(enrollment_id) WHERE deleted = false;
```

**Effort:** 30 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #11: Performance Service Missing Database Migration Files

**Severity:** 🟠 HIGH (Database initialization fails)  
**File:** `backend/performance/src/main/resources/db/migration/` (EMPTY)  

**Fix:** Create `V1__init_performance.sql`:

```sql
-- ============================================
-- Zynctra Performance Management Schema
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    reviewer_id VARCHAR(64) NOT NULL,
    review_type VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    review_period_start DATE,
    review_period_end DATE,
    review_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    goal_text TEXT NOT NULL,
    goal_category VARCHAR(100),
    target_completion_date DATE,
    completion_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    weight_percentage INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(128),
    updated_at TIMESTAMP,
    updated_by VARCHAR(128),
    deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_reviews_employee ON reviews(tenant_id, employee_id) WHERE deleted = false;
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id) WHERE deleted = false;
CREATE INDEX idx_goals_employee ON goals(tenant_id, employee_id) WHERE deleted = false;
```

**Effort:** 20 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #12: Security-Admin Uses Non-Flyway Migrations

**Severity:** 🟠 HIGH (Flyway doesn't recognize schema.sql)  
**File:** `backend/security-admin/src/main/resources/db/migration/schema.sql`  
**Problem:** schema.sql is not a Flyway-versioned migration

**Config:**
```yaml
# security-admin/application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    schemas: ...
```

**Fix:** Rename `schema.sql` to `V1__init_securityadmin.sql`

**Effort:** 2 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #13: Missing zynctra_securityadmin Database in docker-compose

**Severity:** 🟠 HIGH (Service cannot initialize)  
**Problem:** security-admin expects `zynctra_securityadmin` database but it's not in docker-compose

**Config:**
```yaml
# security-admin/application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/zynctra_securityadmin
```

**Fix:** Add to docker-compose.yml:

```yaml
postgres-securityadmin:
  image: postgres:15-alpine
  container_name: zynctra-postgres-securityadmin
  environment:
    POSTGRES_DB: zynctra_securityadmin
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  ports:
    - "5437:5432"
  volumes:
    - postgres_securityadmin_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  postgres_securityadmin_data:
```

Also add to depends_on for security-admin service.

**Effort:** 5 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #14: Missing zynctra_performance Database in docker-compose

**Severity:** 🟠 HIGH (Service cannot initialize)  

**Fix:** Add to docker-compose.yml:

```yaml
postgres-performance:
  image: postgres:15-alpine
  container_name: zynctra-postgres-performance
  environment:
    POSTGRES_DB: zynctra_performance
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  ports:
    - "5439:5432"
  volumes:
    - postgres_performance_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  postgres_performance_data:
```

**Effort:** 3 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #15: Benefits Service Database Configuration Unclear

**Severity:** 🟠 HIGH (Service may use wrong database)  
**File:** `backend/benefits/src/main/resources/application.yml`  
**Problem:** Uses generic `zynctra` database name instead of dedicated `zynctra_benefits`

**Current:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:zynctra}
```

**Fix:** Change to dedicated database:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:zynctra_benefits}
```

Also add postgres-benefits service to docker-compose (see Issue #13 pattern).

**Effort:** 5 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #16: Database Port Conflicts - Multiple Databases Want Port 5432

**Severity:** 🟠 HIGH (Configuration nightmare)  
**Problem:** Services in application.yml all point to localhost:5432 but docker-compose uses different ports

**Services affected:**
- auth → port 5432 ✓ (docker-compose maps to 5432)
- core-hr → port 5432 (docker-compose maps to 5433)
- payroll → port 5432 (docker-compose maps to 5434)
- security-admin → port 5432 (conflict)
- benefits → port 5432 (conflict)
- time-attendance → port 5436 (conflict, wants 5432)

**Fix:** Update application.yml files for services to use environment variables:

**File:** `backend/security-admin/src/main/resources/application.yml`

Change from:
```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/zynctra_securityadmin
```

To:
```yaml
datasource:
  url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5437}/zynctra_securityadmin
```

And in docker-compose for security-admin service:
```yaml
environment:
  DB_HOST: postgres-securityadmin
  DB_PORT: 5432  # Port inside container
```

**Effort:** 1 hour  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #17: Database Username Inconsistencies

**Severity:** 🟠 HIGH (Authentication failures)  
**Problem:** Services expect different database usernames

**Current Situation:**
```
auth-service       expects: ${DB_USER:postgres}
ats-service        expects: ${DB_USERNAME:zynctra}  ← DIFFERENT VARIABLE NAME
time-attendance    expects: ${DB_USER:timeattendance_app}  ← DIFFERENT DEFAULT
benefits           expects: ${DB_USER:zynctra_app}  ← DIFFERENT DEFAULT
security-admin     expects: ${DB_USER:securityadmin_app}  ← DIFFERENT DEFAULT
```

**Fix Option A (Preferred):** Standardize on `${DB_USER:postgres}` everywhere

Edit files:
- `ats/application.yml`: Change `DB_USERNAME` to `DB_USER`
- `time-attendance/application.yml`: Change default to `postgres`
- `benefits/application.yml`: Change default to `postgres`
- `security-admin/application.yml`: Change default to `postgres`

**Fix Option B:** Create database users in postgresql

```sql
CREATE ROLE timeattendance_app LOGIN PASSWORD 'password';
CREATE ROLE zynctra_app LOGIN PASSWORD 'password';
CREATE ROLE securityadmin_app LOGIN PASSWORD 'password';
```

Then set environment variables in docker-compose.

**Recommendation:** Use Fix Option A (simpler)

**Effort:** 30 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #18: Tenant Validation Missing in JWT Filter

**Severity:** 🟠 HIGH (Security - tenant context bypass)  
**File:** `backend/common-lib/src/main/java/com/zynctra/common/config/JwtAuthenticationFilter.java`  
**Problem:** Extracts tenant_id from JWT but doesn't validate it matches X-Tenant-ID header

**Current Code Logic:**
```java
String tenantId = claims.get("tenant_id", String.class);
List<String> roles = claims.get("roles", List.class);
// Sets in context without validation
```

**Fix:** Add validation:

```java
String headerTenant = request.getHeader("X-Tenant-ID");
String jwtTenant = claims.get("tenant_id", String.class);

if (headerTenant != null && !headerTenant.equals(jwtTenant)) {
    throw new SecurityException("Tenant mismatch: header=" + headerTenant + ", jwt=" + jwtTenant);
}
```

**Effort:** 20 minutes  
**Status:** [ ] NOT STARTED  

---

### ⚠️ Issue #19: Connector Service Uses Different Parent POM

**Severity:** 🟠 HIGH (Version inconsistency)  
**File:** `backend/connector-service/pom.xml`  
**Problem:** Uses Spring Boot parent directly instead of zynctra-backend parent

**Current:**
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
    <relativePath/>
</parent>
```

**Should be:**
```xml
<parent>
    <groupId>com.zynctra</groupId>
    <artifactId>zynctra-backend</artifactId>
    <version>1.0.0</version>
    <relativePath>../pom.xml</relativePath>
</parent>
```

**Effort:** 5 minutes  
**Status:** [ ] NOT STARTED  

---

---

## PRIORITY 3: MEDIUM PRIORITY ISSUES (Fix Next Week)

### Issue #20: No API Routes for 6 Services (Missing Gateway Integration)

**Services without routes:**
- [ ] analytics-service
- [ ] security-admin
- [ ] learning
- [ ] performance
- [ ] benefits
- [ ] connector-service

**Fix:** Add routes to `api-gateway/src/main/resources/application.yml`

[See full audit report for complete route configuration]

**Effort:** 2-3 hours  
**Status:** [ ] NOT STARTED  

---

### Issue #21-54: [See Full Audit Report]

**Additional Issues Include:**
- Duplicate service implementations (AuthService, EmployeeService)
- Missing gateway routes
- Service name mismatches
- Soft delete inconsistencies
- Missing documentation
- No distributed tracing
- No centralized config server
- And 28 more...

---

---

## COMPLETION CHECKLIST

### Phase 1: Critical Fixes (Must Complete Before Compile)
- [ ] Issue #1: Fix common-lib/pom.xml
- [ ] Issue #2: Fix payroll/pom.xml
- [ ] Issue #3: Fix learning/pom.xml
- [ ] Issue #4: Fix security-admin/pom.xml
- [ ] Issue #5: Replace hardcoded JWT secret
- [ ] Issue #6: Add Redis to docker-compose
- [ ] Issue #7: Add RabbitMQ to docker-compose
- [ ] Issue #8: Fix port 8083 conflict
- [ ] Issue #9: Set CORS_ALLOWED_ORIGINS

### Phase 2: Database Setup (Must Complete Before Startup)
- [ ] Issue #10: Create benefits migration
- [ ] Issue #11: Create performance migration
- [ ] Issue #12: Rename security-admin schema.sql
- [ ] Issue #13: Add security-admin database
- [ ] Issue #14: Add performance database
- [ ] Issue #15: Fix benefits database config
- [ ] Issue #16: Fix database port conflicts
- [ ] Issue #17: Fix username inconsistencies

### Phase 3: Security (High Priority)
- [ ] Issue #18: Add tenant validation
- [ ] Issue #19: Fix connector service parent POM

### Phase 4: Integration (Later)
- [ ] Issue #20: Add API routes for unrouted services
- [ ] Issue #21+: Additional improvements

---

## TIME ESTIMATE

| Phase | Issues | Time |
|-------|--------|------|
| Phase 1 | 9 issues | 1-2 hours |
| Phase 2 | 9 issues | 2-3 hours |
| Phase 3 | 2 issues | 1 hour |
| Phase 4 | 25+ issues | 10+ hours |
| **TOTAL** | **54 issues** | **14-16 hours** |

**Parallelizable:** Most Phase 1 and 2 items can be done in parallel by 2-3 developers

---

## SUCCESS CRITERIA

After all fixes in Phases 1-2:

```bash
# This should succeed without errors:
mvn clean install

# This should start all services:
docker-compose up -d

# This should return UP:
curl http://localhost:8000/actuator/health
curl http://localhost:8001/auth/actuator/health
curl http://localhost:8002/hr/actuator/health
...
```

---

**Generated:** June 15, 2026  
**Next Review:** After Phase 1 completion
