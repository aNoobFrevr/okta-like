## End-User Use Cases

### 1. Self-Service Registration
**Actor**: New user  
**Preconditions**:  
- Registration enabled for target tenant  
- (Optional) Invitation or domain-based allowlist configured  

**Flow**:  
1. User lands on “Sign Up” page.  
2. Enters email, username, password, and custom attributes.  
3. System validates password policy, checks email uniqueness, creates “Pending” user.  
4. Sends verification email with link.  
5. User clicks link → account activated.  
6. (Optional) Prompts profile completion.  

**Postconditions/Value**:  
- Scalable onboarding and prevents fake accounts via email verification.

### 2. Authentication (Login & SSO)
**Actor**: Registered user  
**Preconditions**:  
- Active user record  
- At least one enrolled authentication factor  

**Flow**:  
1. User clicks “Log In” → redirected to hosted login page.  
2. Enters credentials → platform issues authorization code or tokens.  
3. App exchanges code for access & ID tokens.  
4. User lands on protected resource with token.  

**Alternative**: Active session skips login page.  
**Postconditions/Value**: Centralized session & cookie management.

### 3. Password Reset & Recovery
**Actor**: User who forgot password  
**Preconditions**: Password recovery enabled  
**Flow**:  
1. User clicks “Forgot Password.”  
2. Enters email/username.  
3. Platform sends reset link.  
4. User chooses new password → system validates & updates.  

**Postconditions/Value**: Secure self-service, reduces help-desk load.

### 4. MFA Enrollment & Verification
**Actor**: User  
**Preconditions**: MFA policy active  
**Flow**:  
1. Detects missing MFA after primary auth.  
2. Presents MFA options (SMS, TOTP, push, email).  
3. User enrolls TOTP: platform shows QR code.  
4. User scans & verifies code → factor active.  
5. Subsequent logins challenge with factor.  

**Postconditions/Value**: Stronger identity assurance.

### 5. Profile & Account Management
**Actor**: Logged-in user  
**Preconditions**: Authenticated with valid token  
**Flow**:  
1. Access “My Profile.”  
2. Update attributes (name, phone, photo).  
3. View/revoke active sessions.  
4. Review login history/security alerts.  

**Postconditions/Value**: Data up-to-date; improves security visibility.

## Administrator Use Cases

### 1. Tenant & Application Onboarding
**Actor**: IT Admin  
**Preconditions**: Admin permission to create tenant  
**Flow**:  
1. Create new tenant: choose region, domain, security defaults.  
2. Register new application integration: select protocol, redirect URIs, grant types.  
3. Assign access policies, attribute mappings.  
4. Save → client ID/secret or SAML metadata generated.  

**Postconditions/Value**: App bound to tenant, ready for dev integration.

### 2. User & Group Provisioning
**Actor**: Admin or HR System (via SCIM)  
**Preconditions**: SCIM connector or manual invite enabled  
**Flow (SCIM)**:  
1. HR sends SCIM POST /Users → platform creates user.  
2. HR PATCH /Users → updates profile/group.  
3. HR DELETE /Users → deactivates user.  

**Flow (Manual)**:  
1. Admin invites user; platform emails invite.  

**Postconditions/Value**: Automated joiner/mover/leaver workflows.

### 3. Security Policy Configuration
**Actor**: Security Admin  
**Preconditions**: Baseline security policy object  
**Flow**:  
1. Configure password policy (length, complexity).  
2. Configure MFA policy by group/risk.  
3. Configure session policy (timeouts).  
4. (Optional) Set adaptive rules.  

**Postconditions/Value**: Consistent security across users/apps.

### 4. Directory & Identity Source Integration
**Actor**: IT Admin  
**Preconditions**: On-prem AD/LDAP reachable  
**Flow**:  
1. Add directory: enter host, port, credentials.  
2. Map attributes → internal schema.  
3. Test & enable sync schedule.  

**Postconditions/Value**: Single source of truth for identities.

### 5. Audit, Logging & Monitoring
**Actor**: Compliance Officer/Security Team  
**Preconditions**: Log streaming or dashboard access  
**Flow**:  
1. Filter logs by event type.  
2. Export to SIEM/S3; set retention.  
3. Define alert rules for anomalies.  
4. Drill into raw logs for forensics.  

**Postconditions/Value**: Visibility for audits; real-time security alerts.

## Developer Use Cases

### 1. OAuth2 Authorization Code Flow (with PKCE)
**Actor**: Frontend/mobile developer  
**Preconditions**: Authorization_code grant + PKCE enabled  
**Flow**:  
1. Generate code_verifier/challenge.  
2. Redirect to /authorize with parameters.  
3. User consents; receives auth code.  
4. Exchange code for tokens at /token with code_verifier.  

**Postconditions/Value**: Secure, standards-compliant login.

### 2. Token Refresh & Revocation
**Actor**: Backend service/client  
**Preconditions**: Refresh token issued; valid client credentials  
**Flow**:  
1. Call /token with grant_type=refresh_token.  
2. Platform issues new access token.  
3. To revoke, call /revoke.  

**Postconditions/Value**: Seamless sessions; immediate termination on logout.

### 3. UserInfo & Custom Claims Mapping
**Actor**: API developer  
**Preconditions**: openid/profile scopes; claims mapping configured  
**Flow**:  
1. Call /userinfo with access token.  
2. Receive standard & custom claims.  
3. Use claims for authorization/UI.  

**Postconditions/Value**: Single source for user attributes.

### 4. Role-Based Access & Scope Enforcement
**Actor**: App developer  
**Preconditions**: Roles/groups and scopes configured  
**Flow**:  
1. Request scopes during login.  
2. Validate token claims in API middleware.  

**Postconditions/Value**: Fine-grained authorization.

### 5. Webhooks & Event Subscriptions
**Actor**: Integration developer  
**Preconditions**: Webhook endpoint and events registered  
**Flow**:  
1. Platform POST events (user.created, etc.).  
2. Service acknowledges; platform retries on failure.  

**Postconditions/Value**: Real-time event-driven integrations.

## Compliance & Security Officer Use Cases

### 1. Compliance Reporting & Audit Export
**Actor**: Compliance officer  
**Preconditions**: Audit logging enabled  
**Flow**:  
1. Generate reports (date range, event types).  
2. Export CSV/PDF or schedule delivery.  

**Postconditions/Value**: Audit readiness; regulatory compliance.

### 2. Incident Detection & Response
**Actor**: Security operations team  
**Preconditions**: Alerts defined; SIEM integration  
**Flow**:  
1. Alert triggers; investigate logs.  
2. Revoke sessions/tokens on compromise.  
3. Force password reset/MFA on next login.  

**Postconditions/Value**: Rapid incident containment.

### 3. Data Residency & Privacy Controls
**Actor**: Data privacy officer  
**Preconditions**: Multi-region and key management enabled  
**Flow**:  
1. Select data regions; configure key settings.  
2. Enforce retention/"right to be forgotten."  

**Postconditions/Value**: GDPR/CCPA/HIPAA compliance.

## Platform Operations Use Cases

### 1. Health Monitoring & Auto-Scaling
**Actor**: SRE/DevOps engineer  
**Preconditions**: Monitoring system integrated  
**Flow**:  
1. Monitor metrics and dashboards.  
2. Auto-scale based on policies.  
3. Notify SRE on threshold breaches.  

**Postconditions/Value**: High availability; cost efficiency.

### 2. Backup, Disaster Recovery & DR Drills
**Actor**: Ops team lead  
**Preconditions**: Automated backups configured  
**Flow**:  
1. Backup to remote storage.  
2. Quarterly DR drill: restore & test.  

**Postconditions/Value**: Verified RTO/RPO; business continuity.

### 3. Secret Management & Credential Rotation
**Actor**: Security/systems engineer  
**Preconditions**: Vault/KMS integration  
**Flow**:  
1. Store secrets in vault.  
2. Rotate per schedule; revoke old versions.  

**Postconditions/Value**: No hard-coded secrets; reduced blast radius.

### 4. Zero-Downtime Upgrades & Canary Deployments
**Actor**: Release engineer  
**Preconditions**: CI/CD and staging in place  
**Flow**:  
1. Deploy canary slice; run smoke tests.  
2. Roll out incrementally; rollback on failures.  

**Postconditions/Value**: Continuous delivery with minimal impact.
