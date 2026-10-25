# Architecture & Technical Decisions (DECISIONS.md)

This log records architectural and technical decisions made during the construction of NaqshLab, adhering to Section 0 and Section 10 of the Master Build Prompt.

---

### DEC-001: Monorepo Structure & Package Boundaries
- **Decision**: Structure as `apps/web` (Next.js 14+ App Router), `apps/worker` (FastAPI Python 3.11 geometry & QC computation worker), and `packages/shared` (TypeScript types, Zod schemas, design tokens, i18n keys).
- **Rationale**: Isolates heavy computational geometry (NumPy, SciPy, OpenCV, Trimesh, Shapely, ezdxf, colour-science) inside a dedicated internal worker service while keeping the web application fast, modern, and reactive.

### DEC-002: Dual Database Adapter Architecture (PostgreSQL 16 & SQLite Fallback)
- **Decision**: Prisma schema supports standard PostgreSQL 16 (in Docker/production) with identical migrations and an automatic SQLite/in-memory test mode when Docker/external DB is not active in the local execution sandbox.
- **Rationale**: Guarantees zero friction in environments without Docker active, while fully supporting the specified production stack.

### DEC-003: Cryptographic Audit Trail Architecture
- **Decision**: Audit log rows form a strictly forward-chained Merkle structure where $H_i = \text{SHA256}(H_{i-1} \parallel \text{timestamp} \parallel \text{userId} \parallel \text{action} \parallel \text{entityId} \parallel \text{payloadJSON})$.
- **Rationale**: Enforces tamper-evidence. Tampering with any row invalidates all subsequent rows. A CLI tool `make verify-audit` and an automated unit test verify the chain integrity.

### DEC-004: Strict Replica & Anti-Ageing Enforcement (R1, R2)
- **Decision**: 
  1. The replica statements (`NUSXA — ASL EMAS` and `REPLICA — NOT AN ORIGINAL`) are required fields in the domain models (Piece, JobCard, QCReport, Certificate, InvoiceItem). Omitting them raises schema validation errors and aborts creation.
  2. The finish enum explicitly excludes patina, distressing, antique staining, or artificial wear. Any API payload containing such values returns HTTP 422 Unprocessable Entity.
- **Rationale**: Safeguards historical integrity; prevents fraudulent secondary market exploitation.

### DEC-005: Canonical JSON Representation for Certificate Signatures
- **Decision**: Certificates are serialized using RFC 8785 Canonical JSON before SHA-256 hashing and Ed25519 signing.
- **Rationale**: Deterministic key sorting, spacing, and number formatting prevent signature validation discrepancies across different runtimes and languages.

### DEC-006: Studio Visual Identity & Component Design System
- **Decision**: Pure CSS Custom Properties matching the specification:
  - `--paper: #FFFFFF`
  - `--mist: #F4F7FB`
  - `--line: #D9E3EE`
  - `--ink: #0E2238`
  - `--ink-muted: #4A6079`
  - `--cobalt: #1D4E9A`
  - `--cobalt-deep: #163C78`
  - `--ishkor: #5E9DBE` (decorative only)
  - `--success: #1F7A5A`
  - `--warning: #9A6A12`
  - `--danger: #A3372D`
  - Typography: Headings in Source Serif 4, UI/body in IBM Plex Sans, numbers/measurements/serials in IBM Plex Mono.
  - No gradients, no glassmorphism, no purple/indigo, border-radius max 4px, 1px borders.
- **Rationale**: Conveys heritage craftsmanship, architectural precision, and laboratory rigor.
