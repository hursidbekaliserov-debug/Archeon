# Testing Strategy & Quality Gates (TESTING.md)

NaqshLab enforces strict quality gates across mathematical computations, cryptographic chains, security boundaries, and user interactions.

## 1. Unit Test Suites
- **CIEDE2000 Verification**: Validates $\Delta E_{00}$ calculations against the published reference dataset from Sharma, Wu, & Dalal (2005) covering diverse $L^*, a^*, b^*$ pairs.
- **Computational Geometry & Shrinkage**: Validates $(1+s)$ coordinate scaling, area, volume, and bounding box metrics for standard geometric primitives.
- **CNC Safety Limits**: Asserts that toolpaths exceeding the $300 \times 180 \text{ mm}$ workspace or exceeding maximum cutting depth are strictly rejected.
- **Audit Chain Cryptographic Integrity**: Verifies that any tampered row in the SHA-256 hash chain is immediately detected and flagged as corrupted.
- **RBAC Permission Matrix**: Tests matrix across all 5 roles (`CLIENT`, `EXPERT`, `WORKSHOP`, `OPERATOR`, `PUBLIC`) against every system resource.
- **Rule Enforcement**: Asserts that any attempt to specify artificial ageing or patina produces HTTP 422, and that omitting replica statements fails validation.

## 2. Integration & Worker Pipeline Tests
- Synthetic tile pipeline: end-to-end rectification of ArUco marker, symmetry detection, gap filling, and watertight mesh export.

## 3. End-to-End Tests (Playwright)
- Full client lifecycle: project initialization, consent recording, upload handling, expert candidate approval, 3D model generation, price quotation, order placement, workshop checklist execution, QC pass, Ed25519 expert signature, and public `/v/{serial}` verification.
- Tamper detection test: intentional modification in test storage verifies that the public verification page triggers the warning: `Ma'lumot o'zgartirilgan bo'lishi mumkin`.
- Revocation test: verifies status transitions to `Qaytarib olingan (REVOKED)`.

## 4. Accessibility & UI Compliance
- Automated `axe-core` sweeps ensuring zero critical accessibility violations.
- Keyboard-only navigation path validation across primary workflows.
- Verification that no gradients, purple hues, or unauthorized styles are present in the CSS.
