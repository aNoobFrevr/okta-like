# Okta-Like Platform Architecture

This document captures the detailed architecture for the Okta-like platform, covering:

1. Database Schema Design & Service Interactions
2. CI/CD Pipeline & Infrastructure-as-Code (IaC)
3. Frontend Component Hierarchies & Data-Flow

---

## 1. Database Schema Design

### 1.1 Core Entities

| Table             | Primary Key   | Important Fields                                                |
| ----------------- | ------------- | --------------------------------------------------------------- |
| `tenant`          | `tenant_id`   | `name`, `region`, `domain_allowlist`, `password_policy_id`      |
| `user`            | `user_id`     | `tenant_id`, `email`, `username`, `status`, `password_hash`     |
| `application`     | `app_id`      | `tenant_id`, `type` (OAuth/SAML), `client_id`, `client_secret`  |
| `session`         | `session_id`  | `user_id`, `refresh_token`, `expires_at`, `device_info`         |
| `mfa_factor`      | `factor_id`   | `user_id`, `type` (TOTP/SMS), `secret`, `verified_at`           |
| `policy`          | `policy_id`   | `tenant_id`, `type` (password/mfa/session), `config_json`       |
| `audit_log`       | `log_id`      | `actor_id`, `event_type`, `resource_id`, `timestamp`, `payload` |
| `directory_map`   | `map_id`      | `tenant_id`, `external_id`, `internal_user_id`, `last_sync`     |
| `secret_rotation` | `rotation_id` | `tenant_id`, `target`, `schedule_rrule`, `last_rotated_at`      |

### 1.2 Relationships & Indexes

* `tenant` 1––∞ `user`, `application`, `policy`, `directory_map`
* `user` 1––∞ `session`, `mfa_factor`, `audit_log`
* Unique indexes on `user(email, tenant_id)`, `application(client_id)`.
* Foreign keys enforce tenant scoping and referential integrity.

---

## 2. Service Interactions

### 2.1 User Registration Flow

```sequence
User->Public-API: POST /signup {email, username, password}
Public-API->User-Service: createPendingUser()
User-Service->Email-Svc: sendVerification(email, token)
Public-API-->User: 202 Accepted
User->Email Link: GET /verify?token
Public-API->User-Service: activateUser(token)
User-Service-->Public-API: 200 OK
Public-API-->User: account activated
```

### 2.2 OAuth2 Authorization Code + PKCE

1. **Browser** generates `code_verifier` & `code_challenge`.
2. Redirect to `/authorize?response_type=code&client_id=…&code_challenge=…`
3. **Auth-Service** validates user session & consent → returns `auth_code`.
4. **Backend** POST `/token` with `code_verifier` → issues `access_token` + `refresh_token`.
5. **Client** uses `access_token` for API calls.

### 2.3 SCIM Directory Sync

* **Scheduler** triggers every 5 min → Directory-Sync Service fetches changes from AD/LDAP.
* For each delta: translate to SCIM payload → POST/PATCH/DELETE → User-Service updates DB.
* On failures: retry with exponential backoff, log to `audit_log`.

---

## 3. CI/CD Pipeline & Infrastructure-as-Code

### 3.1 GitHub Actions Workflow (simplified)

```yaml
name: CI/CD
on:
  push:
    branches: [ main ]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm test
  docker-publish:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Push Image
        uses: docker/build-push-action@v3
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}/auth-service:latest
  terraform-deploy:
    needs: docker-publish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      - name: Terraform Init
        run: terraform init infra/
      - name: Terraform Apply
        run: terraform apply -auto-approve infra/
```

### 3.2 Terraform Snippet: Tenant Provisioning

```hcl
resource "postgresql_database" "tenant_db" {
  name = "tenant_${var.tenant_id}"
}

resource "google_sql_database_instance" "authdb" {
  name             = "auth-${var.region}"
  database_version = "POSTGRES_14"
  settings {
    tier = "db-f1-micro"
  }
}
```

---

## 4. Frontend Component Hierarchies & Data Flow

### 4.1 Component Tree

```
App
├── PublicPortal
│   ├── SignUpPage
│   │   ├── SignUpForm
│   │   └── VerificationNotice
│   ├── LoginPage
│   │   ├── LoginForm
│   │   └── ForgotPasswordLink
│   └── MFAPrompt
├── EndUserDashboard
│   ├── ProfilePage
│   ├── SessionList
│   └── MFAManagement
├── AdminConsole
│   ├── TenantSettings
│   ├── ApplicationWizard
│   ├── UserProvisioning
│   └── PolicyEditor
└── DevConsole
    ├── ClientList
    ├── TokenPlayground
    └── APIDocs
```

### 4.2 Data Flow Example: Login → Dashboard

```flow
User -> LoginForm: submit(credentials)
LoginForm -> AuthService: POST /api/auth/token
AuthService -> LoginForm: { access_token, user }
LoginForm -> LocalStorage: save(tokens)
LoginForm -> App: navigate("/dashboard")
App -> DashboardPage: useEffect(fetchProfile)
DashboardPage -> PublicAPI: GET /api/user/profile
PublicAPI -> DashboardPage: profileData
DashboardPage -> UI: render(profileData)
```

---

*End of architecture overview.*
