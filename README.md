# Zynctra HR - Enterprise AI-Powered HR Platform

**Version**: 1.0.0 | **Status**: Production-Ready Architecture

## 📋 Overview

Zynctra is a **highly secure, multi-tenant, AI-powered all-in-one HR platform** designed to consolidate Core HR, Payroll, Talent Acquisition, Time & Attendance, and intelligent assistant capabilities into a single, unified system.

### Key Differentiators

✅ **Transparent, All-in-One Pricing** - No hidden fees. Clear tier structure (Startup/Business/Enterprise)  
✅ **Built-in Payroll Engine** - Full multi-country payroll with tax compliance  
✅ **Enterprise Security** - MFA, encryption, audit logging, autonomous anomaly detection  
✅ **AI-Powered Assistance** - Groq LLM integration with multi-provider flexibility  
✅ **Modern Architecture** - Microservices, Kubernetes-ready, cloud-native  
✅ **Developer-Friendly APIs** - REST + gRPC, comprehensive documentation  
✅ **Autonomous Self-Defense** - Real-time security threat detection and response  

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS + Framer Motion | Modern, responsive SPA |
| **API Gateway** | Spring Cloud Gateway | Authentication, rate limiting, routing |
| **Backend Services** | Java Spring Boot 3.x | Microservices for each HR module |
| **AI Services** | Python 3.11+ with FastAPI | NLP, anomaly detection, analytics |
| **Connectors** | Node.js + TypeScript | Third-party integrations (Workday, Slack, etc.) |
| **Database** | PostgreSQL + MongoDB | Transactional + NoSQL for logs/analytics |
| **Cache** | Redis | Session management, rate limiting |
| **Infrastructure** | Kubernetes + Terraform | Containerized, IaC, auto-scaling |
| **Monitoring** | Prometheus + Grafana + ELK | Metrics, logs, observability |
| **Secrets** | HashiCorp Vault | Dynamic secrets, encryption key management |

### Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend (SPA)              │
│              LoadingPage → LandingPage → App        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│           API Gateway (Authentication)              │
│    JWT Validation • CSRF Protection • Rate Limit    │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐  ┌───▼─────────┐  ┌▼──────────┐
│  Core HR     │  │   Payroll   │  │    ATS    │
│  Service     │  │  Service    │  │  Service  │
└───────┬──────┘  └───┬─────────┘  └┬──────────┘
        │              │              │
┌───────▼──────────────▼──────────────▼─────────────┐
│     PostgreSQL (Per-Tenant Schemas/Isolation)      │
│            Encrypted at Rest (AES-256)             │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│           Python AI Services                       │
│  ├─ Groq LLM (Policy drafting, Q&A)               │
│  ├─ Anomaly Detection (Payroll, Login patterns)    │
│  └─ Analytics (Attrition, compensation)            │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│       Node.js Connectors                           │
│  ├─ Workday Sync    ├─ Slack Integration          │
│  ├─ Salesforce ATS  ├─ Okta/Entra ID              │
│  └─ QuickBooks Sync └─ Custom Webhooks            │
└────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (frontend, connectors)
- **Java** 17+ (backend)
- **Python** 3.11+ (AI services)
- **Docker & Docker Compose** (local development)
- **Kubernetes** 1.24+ (production)

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/zynctra/zynctra-monorepo.git
cd zynctra-monorepo

# Setup environment
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local
cp ai-services/.env.example ai-services/.env.local

# Configure for local development
# frontend/.env.local
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WEBSOCKET_URL=ws://localhost:8080/ws
REACT_APP_LLM_PROVIDER=groq
REACT_APP_GROQ_MODEL=mixtral-8x7b-32768

# backend/.env.local
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/zynctra
GROQ_API_KEY=your-groq-key

# ai-services/.env.local
LLM_PROVIDER=groq
GROQ_API_KEY=your-groq-key
```

### Start Local Stack

```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.yml up -d

# Watch logs
docker-compose logs -f

# Frontend will be at: http://localhost:3000
# API at: http://localhost:8080
# Admin terminal (for admins only): Dashboard → Settings → Admin Terminal
```

### Development Workflow

```bash
# Frontend development (hot reload)
cd frontend
npm install
npm run dev

# Backend development
cd backend
mvn clean install
mvn spring-boot:run

# Python AI services
cd ai-services
pip install -r requirements.txt
python -m nlp_assistant.main

# Run tests
npm test                 # Frontend unit tests
mvn test                 # Backend unit tests
pytest ai-services/     # Python tests

# Run security checks
npm audit               # Frontend dependencies
mvn dependency:check    # Backend dependencies
snyk test              # Vulnerability scanning
```

---

## 🔐 Security Architecture

### Core Security Controls

**1. Authentication & Authorization**
```
User Login → JWT Token (short-lived, 15 min)
           → Refresh Token (long-lived, 7 days)
           → MFA Required (TOTP, Authy, security keys)
           → RBAC/ABAC Enforcement per endpoint
```

**2. Multi-Tenancy Isolation**
```
Per-tenant database schemas + row-level security
Encryption key segregation via HSM
Tenant ID injected into all queries (TenantContext)
Cross-tenant data access: DENIED
```

**3. Data Encryption**
```
At Rest:   AES-256 (RDS, S3, backups)
In Transit: TLS 1.3 (HTTPS + WSS)
Secrets:   Vault (dynamic rotation, no hardcoding)
```

**4. Audit & Logging**
```
All admin actions logged to immutable ledger
Sensitive data masked (SSN, bank accounts)
Structured JSON logging for ELK stack
Retention: 7 years (regulatory compliance)
```

**5. Anomaly Detection**
```
Autonomous AI engine monitors:
  ├─ Payroll anomalies (unusual amounts, off-hours)
  ├─ Login patterns (impossible travel, brute-force)
  ├─ Data exfiltration (bulk exports, API abuse)
  └─ Privilege escalation (RBAC violations)

Automated responses:
  ├─ Token invalidation
  ├─ Session rotation
  ├─ Source IP isolation
  └─ Admin alerts + incident logging
```

### Compliance

- ✅ **GDPR** - Data residency, right to forget, consent management
- ✅ **SOC2 Type II** - Audited controls, encryption, access logs
- ✅ **HIPAA** - BAA available, encryption, audit trails
- ✅ **CCPA** - Privacy controls, data portability
- ✅ **PCI-DSS** (if handling payments) - Tokenization, no plaintext storage

---

## 🤖 AI Services: Groq Integration

### LLM Provider Factory Pattern

The AI services layer uses a **factory pattern** allowing seamless switching between LLM providers at runtime:

```python
# Environment configuration (no code changes needed)
LLM_PROVIDER=groq              # Primary: fast, cost-effective
GROQ_API_KEY=xxx
GROQ_MODEL=mixtral-8x7b-32768

# To switch providers, just change env vars:
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4

# Or use local model for sensitive data:
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama2
```

**Supported Providers**:
- **Groq** (default) - Fastest, cheapest, ideal for HR operations
- **OpenAI** - For complex reasoning (compensation analysis)
- **Anthropic Claude** - For sensitive HR document generation
- **Ollama** - Local model for on-premises/offline scenarios

### AI Use Cases

```
1. Policy Drafting
   "Draft an anti-harassment policy for our company"
   → Groq generates, HR reviews, approves

2. Compensation Analysis
   "Analyze salary equity across departments"
   → Anomaly detector + OpenAI for insights

3. Predictive Attrition
   "Which employees are at risk of leaving?"
   → ML model identifies, recommendations provided

4. FAQ Chatbot
   "What's our PTO policy?"
   → Groq retrieves from knowledge base, responds instantly
```

---

## 🛡️ Secure Terminal (Admin Only)

The **Embedded Secure Terminal** allows root administrators to execute system commands with:

```typescript
// Only available to SUPER_ADMIN and TENANT_ADMIN roles

// Features:
├─ WebSocket over TLS (wss://)
├─ Command whitelist validation
├─ Rate limiting (5 commands/sec)
├─ All commands logged to immutable audit ledger
└─ Multi-session support with isolation

// Whitelisted commands (read-only by default):
├─ System info: ls, pwd, whoami, uptime
├─ Network: dig, nslookup, telnet
├─ Database: psql, mysql (read-only)
├─ Kubernetes: kubectl (read-only)
└─ Audit: audit, security-status

// Access:
Dashboard → Settings → Admin Console → Terminal
(MFA required, session logged with full command history)
```

---

## 📊 Pricing Model (Transparent, No Hidden Fees)

### Startup Tier - $199/month
- Up to 100 employees
- Core HR + Basic Time Tracking
- Employee self-service portal
- Standard reports
- Email support
- SLA: 99.5% uptime

### Business Tier - $599/month (Most Popular)
- Up to 500 employees
- All Startup features +
- **Built-in Payroll Engine**
- Applicant Tracking (ATS)
- Benefits administration
- Performance management
- Advanced workflows
- Phone + Chat 24/7 support
- SLA: 99.9% uptime

### Enterprise Tier - $1,299/month
- 500+ employees
- All Business features +
- **Global Multi-Country Payroll**
- Advanced AI Assistant
- Custom integrations
- Learning Management System (LMS)
- Dedicated account manager
- Priority 24/7 support
- Custom SLA & deployment

**All tiers include**:
- GDPR/SOC2 compliance
- Encryption at rest + transit
- MFA enforcement
- Mobile apps (iOS/Android)
- API access
- Audit logging
- 99.9% uptime SLA

---

## 🚢 Deployment

### Development Environment

```bash
docker-compose -f docker-compose.yml up
# Frontend: http://localhost:3000
# API: http://localhost:8080
# Postgres: localhost:5432
```

### Staging Environment

```bash
# Deploy to staging k8s cluster
kubectl apply -f infra/kubernetes/namespaces.yml
kubectl apply -f infra/kubernetes/configmaps/
kubectl apply -f infra/kubernetes/deployments/

# Monitor
kubectl get pods -n zynctra
kubectl logs -f deployment/api-gateway -n zynctra
```

### Production Environment

```bash
# 1. Set secrets in Vault
vault write secret/zynctra/prod \
  DB_PASSWORD=xxx \
  GROQ_API_KEY=xxx \
  JWT_SECRET=xxx

# 2. Deploy with Terraform
cd infra/terraform/environments/production
terraform apply

# 3. Deploy applications with GitOps (ArgoCD)
kubectl apply -f infra/kubernetes/argocd-apps.yml

# 4. Verify deployment
kubectl get all -n zynctra
kubectl port-forward svc/api-gateway 8080:80 -n zynctra
```

### Disaster Recovery

```bash
# Automated daily encrypted backups
# Stored in S3 (separate region)
# RTO: 1 hour | RPO: 1 hour

# To restore:
./scripts/deployment/restore-database.sh production
# Validates backup integrity, performs point-in-time recovery
```

---

## 🧪 Testing & Quality

### Test Coverage Requirements

- **Frontend**: 80%+ coverage (unit + integration)
- **Backend**: 85%+ coverage (unit + integration)
- **End-to-End**: Critical user workflows (Cypress/Playwright)
- **Performance**: Load tests, stress tests (k6, Locust)
- **Security**: SAST, DAST, pen-testing, SCA

### Running Tests

```bash
# Frontend
npm test                    # Unit tests
npm run test:e2e           # End-to-end
npm audit                  # Dependency check

# Backend
mvn clean verify           # All tests
mvn test -Dgroups=unit    # Unit only
mvn test -Dgroups=integration  # Integration only

# Security
npm run security-scan      # Snyk
./scripts/security/run-sast.sh  # SonarQube
./scripts/security/run-dast.sh  # OWASP ZAP
```

---

## 📚 API Documentation

### OpenAPI/Swagger

```
GET /api/swagger-ui.html      # Interactive API docs
GET /api/v3/api-docs.json     # OpenAPI spec
```

### Key Endpoints

```
# Authentication
POST   /api/auth/login                (email + password)
POST   /api/auth/mfa-verify          (TOTP code)
POST   /api/auth/refresh              (JWT refresh)
POST   /api/auth/logout               (invalidate session)

# Core HR
GET    /api/employees                 (list with filters)
POST   /api/employees                 (create)
GET    /api/employees/{id}            (read)
PUT    /api/employees/{id}            (update)
DELETE /api/employees/{id}            (soft delete)

# Payroll
POST   /api/payroll/calculate         (run calculation)
GET    /api/payroll/run/{runId}       (get results)
POST   /api/payroll/approve           (manager approval)
POST   /api/payroll/process           (final processing)

# Admin/Security
GET    /api/admin/audit-logs          (view logs, restricted)
GET    /api/admin/security-events     (anomalies)
POST   /api/admin/terminal/command    (execute, RBAC enforced)
```

---

## 🤝 Contributing

1. **Code Style**: ESLint + Prettier (frontend), Google Java Style (backend)
2. **Git Workflow**: Feature branches → PR with code review → main
3. **Commit Messages**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
4. **Security First**: Run security checks before committing

```bash
# Pre-commit hooks
npm install husky
npm run prepare
# Auto-runs: lint, type-check, security-audit
```

---

## 📞 Support

- **Documentation**: https://docs.zynctra.com
- **Support Portal**: https://support.zynctra.com
- **Email**: support@zynctra.com
- **Community**: https://community.zynctra.com
- **Security Issues**: security@zynctra.com (private disclosure)

---

## 📄 License

Copyright © 2026 Zynctra. All rights reserved.

---

## 🎯 Roadmap

**Phase 1 (0-6 months)**: MVP - Core HR, ATS, Time, Payroll  
**Phase 2 (6-12 months)**: Mobile app, Benefits, Advanced reporting  
**Phase 3 (12-18 months)**: Performance mgmt, Learning, AI Assistant  
**Phase 4 (18-24 months)**: Global payroll, Compensation planning, Advanced analytics  

---

**Built with Security, Scalability, and Enterprise Excellence** 🚀