# NaqshLab Operational Runbook (RUNBOOK.md)

## 1. Quick Start Commands

- Start development stack:
  ```bash
  make dev
  ```
- Seed database with procedural heritage DEMO records:
  ```bash
  make seed
  ```
- Run complete test suite:
  ```bash
  make test
  ```
- Verify cryptographic audit log integrity:
  ```bash
  make verify-audit
  ```
- Run end-to-end browser tests:
  ```bash
  make e2e
  ```
- Spin up production containers (Docker Compose):
  ```bash
  make up
  ```

## 2. Managing ParameterSets & Routes
ParameterSets define the material recipes, shrinkage percentages, firing curves, and dimensional tolerances for manufacturing routes:
- `KASHI` (Ceramic): Bisque firing, glaze application, shrinkage compensation ($s \approx 8\%-10\%$).
- `GANCH` (Plaster): Silicone casting, curing, mandatory hand-carving stage, shrinkage compensation ($s \approx 0.5\%-1.5\%$).
- `CNC_DIRECT`: Monolithic ganch block machining followed by mandatory artisanal hand-carving.

**To introduce a new ParameterSet version**:
1. Operators navigate to `/admin/ishlab-chiqarish`.
2. Clone existing ParameterSet, adjust shrinkage/recipe/tolerances, and increment version number.
3. Existing active orders retain their original frozen version.

## 3. Onboarding an Expert User
1. Operator navigates to `/admin/foydalanuvchilar`.
2. Creates user with role `EXPERT`.
3. System automatically generates an Ed25519 keypair for cryptographic QC signing.
4. The private key is encrypted at rest using AES-256-GCM.
