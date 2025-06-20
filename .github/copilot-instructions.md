# `.github/copilot-instructions.md`

---

## applyTo: "\*\*"

# Okta‑Like App Coding Guidelines

These instructions guide GitHub Copilot Chat in Agent Mode to generate and edit code that aligns with our Okta‑like application’s architecture, coding conventions, and security best practices.

## 1. Project Structure

```
/root
├── src
│   ├── auth           # Authentication microservice (Node.js + Express)
│   ├── api-gateway    # API Gateway (Express + JWT validation)
│   ├── users          # User management microservice
│   ├── web-client     # React frontend for user flows
│   ├── shared         # Shared types, utils, middleware
│   └── config         # Environment configs and constants
└── tests              # Jest test suites
```

## 2. Naming & File Conventions

* **Microservices**: lowercase hyphen (e.g., `auth-service`, `user-service`).
* **Source Files**: `camelCase.js` / `.tsx` for React, `PascalCase.ts` for classes.
* **React Components**: `PascalCase` with `.tsx` extension.
* **Environment Files**: `.env.development`, `.env.production` in `config/`.

## 3. Authentication & Security Patterns

* **Token Handling**: Use JWT with RS256. Store private keys in `config/secrets`.
* **Secure Routes**: Apply `authenticateJWT` middleware from `shared/middleware/authMiddleware.ts` on protected endpoints.
* **Password Storage**: Always use bcrypt with salt rounds of 12.
* **MFA Flow**: Define TOTP setup in `auth/totpController.ts` using `otplib`.

## 4. API Design

* **REST Standards**: Use plural resource names (`/users`, `/sessions`).
* **Error Responses**: JSON with `{ status: string, message: string, errorCode?: string }`.
* **OpenAPI**: Maintain `openapi.yaml` in root for all endpoints.

## 5. Coding & Formatting

* **Linting**: ESLint with Airbnb config. Run `npm run lint` before commit.
* **Formatting**: Prettier with `.prettierrc`: 2-space indent, single quotes.
* **TypeScript**: Enable `strict` mode in `tsconfig.json`.
* **Logging**: Use `winston` in `shared/logger.ts`. Include `requestId` in logs.

## 6. Testing

* **Unit Tests**: Jest in `tests/`. Mock external HTTP calls with `nock`.
* **Integration Tests**: Supertest for Express endpoints; place in `tests/integration/`.
* **Coverage**: Target 90%+ coverage; run `npm run test:coverage`.

## 7. CI/CD Checks

* **Pre-Commit Hooks**: Husky to run `lint` and `test` on staged files.
* **GitHub Actions**: Ensure workflows in `.github/workflows` include `lint`, `build`, `test`, and `deploy` jobs.

## 8. Example Code Generation Tasks

Use these task descriptions as prompts when requesting code edits or new implementations. Each prompt should be placed as a comment in your code or entered in Copilot Chat without referencing Copilot itself.

* **Create loginController**

  ```js
  // Task: In `auth/loginController.ts`, implement a function that validates user credentials, issues an RS256 JWT, and logs audit details using winston.
  ```

* **Refactor authentication middleware**

  ```js
  // Task: Refactor `shared/middleware/authMiddleware.ts` to extract token extraction into `getToken(req)` and improve error handling for missing or invalid tokens.
  ```

* **Implement TOTP support**

  ```ts
  // Task: In `auth/totpController.ts`, add `generateTOTPSecret(userId)` and `verifyTOTPCode(userId, code)` functions using otplib, storing secrets securely in Redis.
  ```

* **Build useSession hook**

  ```tsx
  // Task: In `web-client/src/hooks/useSession.ts`, create a React hook that fetches the current JWT from `/sessions`, refreshes tokens on expiration, and provides authentication state to components.
  ```

* **Write unit tests for user service**

  ```ts
  // Task: In `tests/users/userService.test.ts`, write Jest tests for `createUser`, `getUserById`, and `deleteUser`, mocking database calls with jest.fn().
  ```

---

Remember to run linting and tests after applying any generated changes to ensure consistency with project standards.
