# Quick Start Guide - Zynctra Backend

## 🚀 Get Running in 5 Minutes

### Option 1: Docker Compose (Recommended)

```bash
# 1. Build all services
mvn clean package -DskipTests

# 2. Start everything
docker-compose up -d

# 3. Verify services are running
curl http://localhost:8000/actuator/health
```

**Services will be available at:**
- API Gateway: http://localhost:8000
- Auth Service: http://localhost:8001/auth
- HR Service: http://localhost:8002/hr
- Payroll: http://localhost:8003/payroll
- ATS: http://localhost:8004/ats
- Time & Attendance: http://localhost:8005/time-attendance

### Option 2: Local Development

#### Prerequisites
```bash
# Install PostgreSQL 15
# Then create databases:
psql -U postgres -c "CREATE DATABASE zynctra_auth;"
psql -U postgres -c "CREATE DATABASE zynctra_hr;"
psql -U postgres -c "CREATE DATABASE zynctra_payroll;"
psql -U postgres -c "CREATE DATABASE zynctra_ats;"
psql -U postgres -c "CREATE DATABASE zynctra_attendance;"
```

#### Setup Environment
```bash
export JWT_SECRET="your-secure-secret-key-32-chars-min"
export DB_USER=postgres
export DB_PASSWORD=postgres
```

#### Build & Run
```bash
# Build once
mvn clean install

# In separate terminals, run each service:

# Terminal 1: API Gateway
cd api-gateway && mvn spring-boot:run

# Terminal 2: Auth Service
cd auth-service && mvn spring-boot:run

# Terminal 3: Core HR
cd core-hr && mvn spring-boot:run

# Terminal 4: Payroll
cd payroll && mvn spring-boot:run

# Terminal 5: ATS
cd ats && mvn spring-boot:run

# Terminal 6: Time & Attendance
cd time-attendance && mvn spring-boot:run
```

## 🔑 First Steps

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zynctra.com",
    "firstName": "Admin",
    "lastName": "User",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "ADMIN"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "uuid-...",
    "expiresIn": 3600,
    "user": {
      "id": "user-uuid",
      "email": "admin@zynctra.com",
      "firstName": "Admin",
      "role": "ADMIN"
    }
  }
}
```

### 2. Login with Credentials

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zynctra.com",
    "password": "SecurePass123!"
  }'
```

### 3. Get Current User

```bash
# Use the accessToken from login response
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <your-access-token>" \
  -H "X-Tenant-ID: <your-tenant-id>" \
  -H "X-User-ID: <your-user-id>"
```

### 4. Create an Employee

```bash
curl -X POST http://localhost:8000/api/v1/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -H "X-Tenant-ID: <your-tenant-id>" \
  -H "X-User-ID: <your-user-id>" \
  -d '{
    "email": "john.doe@zynctra.com",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Software Engineer",
    "hireDate": "2024-01-15",
    "status": "ACTIVE",
    "salary": 100000,
    "currency": "USD"
  }'
```

### 5. List Employees (Paginated)

```bash
curl -X GET "http://localhost:8000/api/v1/employees?page=0&size=20&status=ACTIVE" \
  -H "Authorization: Bearer <your-access-token>" \
  -H "X-Tenant-ID: <your-tenant-id>" \
  -H "X-User-ID: <your-user-id>"
```

## 📚 Common Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/auth/me | Get current user |
| POST | /api/v1/auth/logout | Logout |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/employees | List all employees |
| POST | /api/v1/employees | Create employee |
| GET | /api/v1/employees/{id} | Get employee details |
| PATCH | /api/v1/employees/{id} | Update employee |
| DELETE | /api/v1/employees/{id} | Delete employee |

### Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/payroll/summary | Get payroll summary |
| POST | /api/v1/payroll/run | Run payroll |
| GET | /api/v1/payroll/history | Get history |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/attendance/clock-in | Clock in |
| POST | /api/v1/attendance/clock-out | Clock out |
| GET | /api/v1/attendance/records | Get records |

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8000

# Or change ports in application.yml
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check databases exist
psql -U postgres -l | grep zynctra
```

### JWT Token Invalid
```bash
# Make sure token is passed in Authorization header
# Format: "Authorization: Bearer <token>"

# Refresh token if expired
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<your-refresh-token>"}'
```

### No Data Returned
```bash
# Make sure X-Tenant-ID header is set
# Make sure X-User-ID header is set (for tenant context)
```

## 📊 Health Checks

```bash
# Check all services
curl http://localhost:8000/actuator/health
curl http://localhost:8001/auth/actuator/health
curl http://localhost:8002/hr/actuator/health
# ... etc

# Get detailed health info
curl http://localhost:8000/actuator/health/details
```

## 🛑 Stop Services

### Docker Compose
```bash
docker-compose down
```

### Local Development
Press `Ctrl+C` in each terminal

## 📖 Full Documentation

- See **README.md** for complete API reference
- See **IMPLEMENTATION_SUMMARY.md** for architecture details

## 🚀 Next Steps

1. **Create test data**: Use the examples above
2. **Explore the APIs**: Try different endpoints
3. **Check the code**: Review service implementations
4. **Extend functionality**: Add new endpoints following existing patterns
5. **Set up monitoring**: Configure Prometheus/Grafana

## 💡 Tips

- Always include `X-Tenant-ID` header for data isolation
- Include `X-User-ID` header for audit logging
- Use pagination (page=0&size=20) for list endpoints
- Tokens expire after 1 hour (configurable)
- Password must be 8+ chars with uppercase, lowercase, number, special char

## 📞 Support

- Check logs: `docker-compose logs -f <service-name>`
- Review code in service directories
- See IMPLEMENTATION_SUMMARY.md for architecture

---

**Happy coding! 🎉**
