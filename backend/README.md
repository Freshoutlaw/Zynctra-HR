# Zynctra HR SaaS Platform - Backend

A complete, production-ready microservices backend for the Zynctra HR management system. Built with Spring Boot 3.2, Spring Cloud Gateway, and PostgreSQL.

## Overview

The backend is organized as a microservices architecture with the following components:

### Core Services

1. **API Gateway** (Port 8000)
   - Central routing for all requests
   - JWT token validation and authorization
   - Request/response logging
   - CORS configuration
   - Rate limiting and circuit breaking

2. **Auth Service** (Port 8001)
   - User registration and login
   - JWT token generation and refresh
   - Password reset and OTP verification
   - MFA setup (TOTP-ready)
   - Session management
   - Refresh token management

3. **Core HR Service** (Port 8002)
   - Employee CRUD operations
   - Employee documents management
   - Department management
   - Org chart functionality
   - Custom employee fields

4. **Payroll Service** (Port 8003)
   - Payroll period management
   - Payroll runs and processing
   - Deduction management
   - Tax calculations
   - Payslip generation

5. **ATS Service** (Port 8004)
   - Job posting CRUD
   - Candidate management
   - Interview scheduling
   - Offer letter generation

6. **Time & Attendance Service** (Port 8005)
   - Clock in/out functionality
   - Attendance records
   - Leave management

## Architecture

### Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Cloud**: Spring Cloud 2023.0.0
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (RS256)
- **API Gateway**: Spring Cloud Gateway

## Getting Started

### Prerequisites

- Java 17+
- PostgreSQL 15+
- Maven 3.8+

### Local Development

1. Create databases:
```bash
createdb zynctra_auth
createdb zynctra_hr
createdb zynctra_payroll
createdb zynctra_ats
createdb zynctra_attendance
```

2. Set environment variables:
```bash
export JWT_SECRET="your-secure-secret-key-min-32-chars"
export DB_USER=postgres
export DB_PASSWORD=postgres
```

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run -pl api-gateway
mvn spring-boot:run -pl auth-service
mvn spring-boot:run -pl core-hr
# ... and so on for other services
```

## API Endpoints

### Authentication
```
POST   /api/v1/auth/login              - Login
POST   /api/v1/auth/register           - Register
POST   /api/v1/auth/refresh            - Refresh token
GET    /api/v1/auth/me                 - Get current user
POST   /api/v1/auth/logout             - Logout
```

### Employees
```
GET    /api/v1/employees               - List employees
POST   /api/v1/employees               - Create employee
GET    /api/v1/employees/{id}          - Get employee
PATCH  /api/v1/employees/{id}          - Update employee
DELETE /api/v1/employees/{id}          - Delete employee
```

### Payroll
```
GET    /api/v1/payroll/summary         - Get payroll summary
POST   /api/v1/payroll/run             - Run payroll
GET    /api/v1/payroll/history         - Get history
```

### ATS
```
POST   /api/v1/ats/jobs                - Create job
GET    /api/v1/ats/jobs                - List jobs
GET    /api/v1/ats/candidates          - List candidates
POST   /api/v1/ats/candidates          - Add candidate
```

### Attendance
```
POST   /api/v1/attendance/clock-in     - Clock in
POST   /api/v1/attendance/clock-out    - Clock out
GET    /api/v1/attendance/records      - Get records
```

## Security Features

✅ JWT Authentication with RS256
✅ Multi-tenancy with X-Tenant-ID header
✅ Input validation on all endpoints
✅ SQL injection prevention
✅ CORS properly configured
✅ Soft deletes for data preservation
✅ Audit logging
✅ Rate limiting ready

## Database Schema

All services use PostgreSQL with:
- UUID primary keys
- Tenant isolation (tenant_id on all tables)
- Soft delete support (deleted_at column)
- Created/Updated audit fields
- Flyway migrations for versioning

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "timestamp": 1699564800000
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "timestamp": 1699564800000
}
```

## Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Use strong JWT_SECRET (32+ random chars)
- [ ] Configure SSL/TLS
- [ ] Set up PostgreSQL backups
- [ ] Enable monitoring/alerting
- [ ] Configure rate limiting
- [ ] Set up centralized logging

## Common Endpoints

### Health
```
GET /actuator/health - Service health
GET /actuator/metrics - Service metrics
```

## Troubleshooting

**Port already in use**: Check `application.yml` or kill process
**Database connection error**: Ensure PostgreSQL is running
**JWT expired**: Use refresh endpoint

## Project Structure

```
backend/
├── common-lib/           # Shared utilities, exceptions, DTOs
├── api-gateway/          # API Gateway routing
├── auth-service/         # Authentication & authorization
├── core-hr/              # Employee management
├── payroll/              # Payroll processing
├── ats/                  # Applicant tracking
├── time-attendance/      # Time & attendance
├── performance/          # Performance reviews
├── benefits/             # Benefits management
├── learning/             # Learning management
├── security-admin/       # Security & admin
├── analytics-service/    # Analytics & reporting
├── connector-service/    # Integrations
└── pom.xml              # Parent POM
```

## Version

1.0.0 - Production Ready

---

For detailed documentation, see individual service README files.
