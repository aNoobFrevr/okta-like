1. Proposed Tech Stack
Layer	Technology	Rationale
API Gateway	Kong / Gloo / AWS API Gateway	Centralized routing, rate-limiting, auth enforcement
Backend	Node.js + NestJS (TypeScript)	Modular controllers/services, built-in DI and testing
Auth Library	OAuth2 Server: @nestjs/passport + JWT	Standards-compliant flows (Auth Code, PKCE, refresh)
Database	PostgreSQL (primary) + Redis (caching/session)	Relational for users/tenants; Redis for sessions/MFA OTP
Message Bus	RabbitMQ / Kafka	SCIM events, webhooks, audit log streaming
Storage	AWS S3 / GCP Cloud Storage	Profile photos, audit exports, backup artifacts
Email/SMS	SendGrid + Twilio	Verification emails, forgot-password, MFA via SMS
Frontend	React + TypeScript + React Router + React Query	Component ecosystem, type safety, data fetching
UI Library	Chakra UI / Ant Design	Accessible, themeable components—for both end-user & admin UIs
CI/CD	GitHub Actions → Docker → GKE (or GCE VMs)	Containerized delivery with canary/blue-green support
Observability	OpenTelemetry + Prometheus + Grafana	Distributed tracing, metrics, dashboards, alerts
Secrets/KMS	HashiCorp Vault / GCP KMS	Centralized secret storage and rotation
Infra-as-Code	Terraform	Repeatable multi-region tenant provisioning
SCIM Connector	Custom NestJS microservice	SCIM 2.0 compliance for HR integrations

2. Core Backend Microservices
Tenant Service

CRUD tenants (region, domain, security defaults)

Store tenant-scoped configs (password/MFA policy)

User Service

Self-registration, email verification, CRUD profiles

Password reset flows, uniqueness checks

Auth Service

OAuth2 endpoints (/authorize, /token, /revoke)

PKCE handling, token issuance (access/refresh/ID tokens)

MFA Service

TOTP generator (QR code), SMS/email challenge, recovery codes

Enroll/verify flows and persistent factor store

Directory Sync Service

SCIM adapter to on-prem AD/LDAP (sync user/group)

Scheduled sync jobs, attribute mapping

Policy Service

Password policy, session timeouts, adaptive rules

Evaluate policies at runtime (e.g. risk-based MFA)

Audit & Webhook Service

Stream events (user.created, password.reset, login.attempt) to message bus

Deliver to SIEM via webhooks or exports to S3

Admin & Developer API Service

Tenant admin endpoints (app onboarding, client ID/secret, SAML metadata)

Developer console APIs (retrieve client credentials, test tokens, claim mappings)

Notifications Service

Unified email/SMS dispatch for verification, alerts, and compliance reports

Ops Service

Health checks, auto-scaling hooks, backup/restore triggers

3. Frontend Modules
Public Portal

Sign-Up / Sign-In / Forgot-Password / MFA Challenge

OAuth2 redirect handling (PKCE flow)

End-User Dashboard

Profile management, session revocation, login history

MFA enrollment UI (QR viewer, recovery code download)

Admin Console

Tenant management (regions, domains, security settings)

Application onboarding (OAuth/SAML config wizard)

User & group provisioning (SCIM / manual invite)

Policy configuration (password, MFA, sessions)

Developer Console

OAuth client dashboard (client ID/secret, redirect URIs, scopes)

API docs (Swagger/OpenAPI UI)

Token playground (authorize code flow tester)

Compliance & Monitoring UI

Audit log viewer with filters and CSV/PDF export

Alert configuration for unusual events

Data residency & privacy settings (right-to-be-forgotten workflows)

Platform Ops Dashboard

System health status, metrics charts, scaling controls

Backup & DR drill interface

Secret rotation schedules

