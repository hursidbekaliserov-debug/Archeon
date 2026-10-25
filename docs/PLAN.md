# NaqshLab — Implementation Plan & Phase Roadmap

**Product**: NaqshLab (raqamli kashi va ganch ishlab chiqarish)  
**Primary Brand Config**: Single source of truth in `packages/shared/src/config.ts` (`BRAND_NAME = "NaqshLab"`).  
**Core Mission**: High-fidelity REPLICAS of traditional Uzbek glazed tile (*kashi*) and carved plaster (*ganch*) for heritage restoration projects, architectural commissions, and certified provenance.

---

## Hard Rules Enforcement (R1–R7)

1. **R1 Replica Statement**: Every physical piece, job card, QC report, certificate, contract PDF, and invoice line must carry:
   - Uzbek: `NUSXA — ASL EMAS`
   - English: `REPLICA — NOT AN ORIGINAL`
   Enforced via Prisma validation hooks, schema constraints, and API gatekeepers.
2. **R2 No Artificial Ageing**: Strict prohibition of patina, distressing, staining to look antique, fake wear, or imitation of museum/inventory stamps. Value rejection returns HTTP 422.
3. **R3 AI is a Suggestion**: AI completions are never auto-committed. Transitions to `APPROVED` require an authorized `EXPERT` role action, producing an immutable audit log entry.
4. **R4 Original Seed Data**: All seed motifs are procedurally generated (girih, islimi, rosette, border) and labeled `DEMO`.
5. **R5 No Fabricated Social Proof**: No fake testimonials, partners, or awards. Placeholders clearly declare their placeholder status.
6. **R6 No Imitation**: No deceptive logos or government lookalikes.
7. **R7 Rights Consent**: Uploads require affirmative consent recorded with user ID, timestamp, and SHA-256 hashed IP.

---

## Phase Breakdown & Acceptance Criteria

### Phase 0: Plan & Scaffold
- Monorepo structure: `apps/web`, `apps/worker`, `packages/shared`, `infra`, `docs`, `seeds`.
- Docker Compose configuration for web, worker, postgres, redis, minio, mailpit.
- Design tokens with studio palette (`--paper`, `--mist`, `--line`, `--ink`, `--ink-muted`, `--cobalt`, `--cobalt-deep`, `--ishkor`, `--success`, `--warning`, `--danger`).
- i18n skeleton for `uz-Latn` (default), `ru`, `en`.
- Root `Makefile` with targets: `up`, `seed`, `dev`, `test`, `e2e`, `verify-audit`.

### Phase 1: Auth, RBAC, Projects, Consent & Audit Hash-Chain
- Passwordless magic link auth with session cookies and CSRF protection.
- Strict RBAC: `CLIENT`, `EXPERT`, `WORKSHOP`, `OPERATOR`, `PUBLIC`.
- Project state machine: `DRAFT` through `DELIVERED` and `CANCELLED`.
- Consent capture: SHA-256 hashed client IP, timestamp, and mandatory check.
- Cryptographic hash-chained Audit Log: each row contains `sha256(prev_hash + row_data)`. CLI verification tool.

### Phase 2: Geometry Worker & Reconstruction Editor
- Python FastAPI worker endpoints: `/rectify`, `/segment`, `/symmetry`, `/complete`, `/vectorize`, `/heightmap`.
- ArUco / checkerboard homography & metric scale calibration.
- FFT/autocorrelation for translational period and symmetry groups ($C_2, C_4, C_6, C_8$).
- Damage mask proposals and completion candidates (symmetry copy-fill, patch inpainting, motif library).
- Vector reconstruction editor with node editing, undo/redo, and strict `EXPERT` approval barrier.

### Phase 3: 3D Modelling & Interactive Studio Viewer
- Watertight 2-manifold mesh generation from heightmaps with base plate (default 8mm) and chamfers.
- Architectural panel splitting with grid modules, alignment keys, and assembly map PDF generation.
- Micro-detail validation: minimum feature width, minimum wall thickness, draft angle ($\ge 2^\circ$), and undercut warnings.
- Interactive Three.js viewer with orbit/pan/zoom, wireframe, cross-section slider, click-to-measure (mm), and deviation heatmap.

### Phase 4: Production Planning, ParameterSets & Workshop Portal
- Versioned `ParameterSet` for Route A (`KASHI`), Route B (`GANCH`), Route C (`CNC_DIRECT`).
- Shrinkage scaling compensation $(1 + s)$ per axis.
- CNC GRBL 1.1 post-processor with 300x180mm envelope and depth boundary checks.
- Job cards with mandatory `NUSXA — ASL EMAS` back-stamp requirement and workshop photo upload validation.

### Phase 5: Quality Control, CIEDE2000 & Expert Cryptographic Signing
- Multi-dimensional caliper and 3D scan deviation analysis (mean, 95th percentile, max, Hausdorff).
- Verified CIEDE2000 implementation matching Sharma, Wu, Dalal (2005) reference dataset.
- Bilingual QC report PDF (uz-Latn, en).
- Per-expert Ed25519 digital signature of passing QC records.

### Phase 6: Certificates & Public Verification (/v/[serial])
- Standard serials: `NLB-KSH-YYYY-NNNNNN` and `NLB-GNC-YYYY-NNNNNN`.
- Canonical JSON (RFC 8785) certificate with SHA-256 hash and Ed25519 signature.
- Public `/v/{serial}` verification page displaying `VALID`, `REVOKED`, or tamper alert (`Ma'lumot o'zgartirilgan bo'lishi mumkin`).
- A5 Certificate PDF with QR code and replica banner.

### Phase 7: Quotes, Orders, Contracts, Payments & Analytics
- Deterministic price engine (surface area, linear meters, complexity class, route, mould fee, rush, transport).
- Contract PDF generation with 30/40/30 milestone payment terms.
- Manual bank transfer flow and payment gateway stubs.
- Admin dashboard: workshop load, QC yield, lead times, and revenue analytics.

### Phase 8: Pattern Library, Complete i18n, Accessibility & Polish
- 20 procedurally generated heritage sample motifs (girih, islimi, rosette, border) with filters.
- Zero hardcoded strings across `uz-Latn`, `ru`, `en`.
- WCAG 2.2 AA compliance: visible focus states, zero axe-core critical violations, keyboard navigability.
- Strict studio aesthetics: no gradients, no glassmorphism, no neon, border-radius $\le 4$px.

### Phase 9: E2E Verification, DEMO Seeds, Documentation & Report
- Playwright E2E end-to-end tests validating the complete lifecycle.
- Seed data population with rich procedural DEMO records.
- Comprehensive documentation and final report in `docs/REPORT.md`.
