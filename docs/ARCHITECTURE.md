# NaqshLab System Architecture

```mermaid
graph TD
    Client[Web Client: Next.js 14 App Router] -->|REST / JSON| WebAPI[Web API Routes & Middleware]
    Public[Public Visitor] -->|Verify /v/serial| WebAPI
    
    subgraph Web App
        WebAPI --> Auth[RBAC & Session Service]
        WebAPI --> AuditService[Tamper-Evident Audit Chain Service]
        WebAPI --> Prisma[Prisma ORM Client]
        WebAPI --> Queue[Job Dispatcher]
    end

    subgraph Geometry & Manufacturing Worker [Python 3.11 FastAPI]
        Queue -->|Internal Network| WorkerAPI[Worker REST API]
        WorkerAPI --> Rectify[Calibration & Homography]
        WorkerAPI --> Symmetry[Symmetry C2-C8 & Periodicity FFT]
        WorkerAPI --> Reconstruct[Damage Mask & Candidate Inpainting]
        WorkerAPI --> Mesh3D[Heightmap to 2-Manifold Mesh & Panel Splitting]
        WorkerAPI --> CNC[GRBL 1.1 Post-Processor & Toolpath Simulator]
        WorkerAPI --> QC[CIEDE2000 & 3D Scan Deviation]
        WorkerAPI --> Crypto[Ed25519 Signing & Canonical JSON]
    end

    subgraph Data Stores
        Prisma --> DB[(PostgreSQL 16 / SQLite)]
        WorkerAPI --> S3[(MinIO / S3 Storage)]
        Queue --> Redis[(Redis BullMQ)]
    end
```

## Subsystem Responsibilities

1. **`apps/web`**:
   - Modern Next.js App Router application with zero hardcoded strings (`next-intl` in `uz-Latn`, `ru`, `en`).
   - Server-side RBAC guards and CSRF protection.
   - Interactive 3D Three.js viewer with cross-section analysis, measurement caliper, and deviation overlay.
   - Vector reconstruction editor for segment inspection and motif candidate selection.
   - Workshop task tracking portal with photo verification.
   - Admin management dashboard and analytics.

2. **`apps/worker`**:
   - Python 3.11 FastAPI computational geometry engine.
   - OpenCV ArUco marker rectification and scale determination.
   - FFT 2D autocorrelation for rotational/translational repeat discovery.
   - Trimesh watertight mesh generation, chamfering, undercut checks, draft angle ($ \ge 2^\circ $) verification.
   - GRBL 1.1 CNC toolpath generator with bounding envelope ($300 \times 180$ mm) and maximum depth safety blocks.
   - Verified CIEDE2000 color difference engine matching Sharma et al. (2005).

3. **`packages/shared`**:
   - Single brand source of truth (`BRAND_NAME = "NaqshLab"`).
   - Replica statement constants (`NUSXA — ASL EMAS` and `REPLICA — NOT AN ORIGINAL`).
   - Shared TypeScript types, Zod schemas, design tokens, and i18n key definitions.

4. **`infra`**:
   - Docker Compose containing `web`, `worker`, `postgres`, `redis`, `minio`, and `mailpit`.
