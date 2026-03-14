---
name: Authentication Implementation
domain: backend
complexity: high
works-with: [architect agent, /feature command]
---

# Authentication Implementation

## When to Use

Use this prompt when you need to implement or overhaul authentication flows, including JWT-based auth, OAuth2 integration, or API key management.

## The Prompt

You are a security-focused backend engineer implementing authentication.

Implement JWT-based authentication with refresh tokens for [FRAMEWORK].

### Context

- **Auth provider**: [AUTH_PROVIDER]
- **User model**: [USER_MODEL]
- **Access token expiry**: [TOKEN_EXPIRY] (e.g. 15 minutes)
- **Refresh token expiry**: 7 days (configurable)

### Implementation Checklist

1. Create auth routes: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
2. Hash passwords with bcrypt (minimum cost factor 12) or Argon2id
3. Generate short-lived access tokens (JWT) with minimal claims: `sub`, `iat`, `exp`, `roles`
4. Generate opaque refresh tokens, store hashed in the database with device/session metadata
5. Implement token rotation — invalidate the old refresh token when issuing a new one
6. Add auth middleware that validates the access token on protected routes
7. Implement role-based authorisation guards
8. Set secure HTTP headers on all auth responses

### Token Payload Structure

```json
{
  "sub": "user_id",
  "iat": 1710000000,
  "exp": 1710000900,
  "roles": ["user"],
  "org_id": "organisation_id"
}
```

### Security Headers

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'`

## Variations

### OAuth2 / OIDC Integration
Integrate with [AUTH_PROVIDER] (e.g. Auth0, Okta, Google).
Implement the Authorisation Code flow with PKCE for SPAs.
Map external identity claims to local user records on first login.

### API Key Authentication
Generate scoped API keys with configurable permissions.
Hash keys before storage (only show the full key once at creation).
Support key rotation with a grace period for the old key.

### Session-Based Authentication
Use server-side sessions stored in Redis with a configurable TTL.
Set `HttpOnly`, `Secure`, `SameSite=Strict` cookie attributes.
Implement CSRF protection with double-submit cookies or synchroniser tokens.

## Tips

- **Token storage**: Never store JWTs in localStorage. Use `HttpOnly` cookies for web clients or secure storage on mobile.
- **Refresh token reuse detection**: If a refresh token is used twice, assume it was stolen — revoke the entire token family and force re-authentication.
- **Rate limiting**: Apply aggressive rate limits on `/auth/login` (e.g. 5 attempts per minute per IP) to mitigate brute-force attacks.
- **Logout**: Maintain a token denylist (in Redis) for invalidated access tokens that have not yet expired.
- **Audit logging**: Log all authentication events (login, logout, token refresh, failed attempts) with IP, user agent, and timestamp.
- **Password policy**: Enforce minimum 10 characters, check against breached password databases (e.g. Have I Been Pwned API).
- Never include sensitive data (password, PII) in JWT claims — tokens are encoded, not encrypted.
