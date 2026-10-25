# NaqshLab Security & Privacy Architecture

## 1. Authentication & Session Management
- **Magic Link Auth**: Secure, time-limited token generation with one-time use consumption.
- **Session Cookies**: `HttpOnly`, `Secure`, `SameSite=Lax` cookies with cryptographically random session IDs.
- **CSRF Protection**: Double-submit cookie or origin/referer verification on all state-altering endpoints.
- **Rate Limiting**: IP-based and user-based bucket rate limiting across public verification (`/v/{serial}`) and authentication endpoints.

## 2. Authorization (Server-Side RBAC)
Role hierarchy and permissions:
- `CLIENT`: Owns projects, uploads source media, reviews reconstruction proposals, views quotes/orders/certificates.
- `EXPERT`: Authorized to approve/reject reconstruction models, review and sign QC runs with Ed25519 digital keys, approve or revoke certificates.
- `WORKSHOP`: Assigned manufacturing tasks, checklist execution, photo and measurement uploads. *Strictly prohibited from signing QC.*
- `OPERATOR`: Full administrative authority over workshops, pricing rules, tolerances, parameter sets, users, and audit logs.
- `PUBLIC`: Read-only verification of issued certificates at `/v/{serial}`.

## 3. Data Integrity & Immutability
- **Immutable Originals**: Client-uploaded source assets are stored read-only and indexed by SHA-256 hash. Derived working copies are generated for processing.
- **Audit Hash Chain**: Every audit row contains a SHA-256 hash incorporating the previous row's hash, timestamp, user ID, action, and payload. Any record modification immediately breaks the chain.
- **Ed25519 Signatures**: Certificate proofs and QC passes are digitally signed by the reviewing expert's Ed25519 key (encrypted at rest; never exposed through any API).
- **Magic-Byte Validation**: All file ingestion validates binary file headers (magic bytes) rather than relying on MIME types or extensions.

## 4. Privacy & External AI Boundary
- By default, `allow_external_ai_processing` is set to `FALSE` on every project.
- Client source imagery is never transmitted to external third-party AI APIs unless the client has explicitly toggled this flag.
