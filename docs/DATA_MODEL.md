# NaqshLab Data Model & Entity Relationship Specification

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Session : has
    User ||--o{ Consent : grants
    User ||--o{ AuditLog : acts_in
    User ||--o{ Project : owns
    Organization ||--o{ User : employs
    Workshop ||--o{ Task : executes

    Project ||--o{ SourceAsset : contains
    Project ||--o{ ReconstructionVersion : versions
    ReconstructionVersion ||--o{ ReconstructionRegion : contains
    ReconstructionVersion ||--o{ Model3D : produces
    Model3D ||--o{ JobCard : generates
    
    ParameterSet ||--o{ JobCard : configures
    JobCard ||--o{ Task : dispatches
    Task ||--o{ ChecklistStep : requires
    
    Piece ||--o{ Measurement : records
    Piece ||--o{ ColourReading : reads
    Piece ||--o{ QCRun : inspected_by
    QCRun ||--o| Certificate : issues
    
    Project ||--o{ Quote : estimates
    Quote ||--o{ QuoteItem : details
    Quote ||--o| Order : creates
    Order ||--o{ OrderEvent : tracks
    Order ||--o{ Invoice : bills
    
    AuditLog {
        string id PK
        string prevHash
        string currentHash
        datetime timestamp
        string userId
        string action
        string entityType
        string entityId
        json payload
    }

    Certificate {
        string serial PK
        string status
        string statementUz
        string statementEn
        string canonicalJsonSha256
        string expertSignature
        datetime issueDate
    }
```

## 2. Core Entities & Attributes

- **User**: ID, email, role (`CLIENT`, `EXPERT`, `WORKSHOP`, `OPERATOR`), name, organizationId, ed25519PublicKey, encryptedEd25519PrivateKey, createdAt.
- **Consent**: ID, userId, projectId, statement, ipHash, consentGiven, timestamp.
- **Project**: ID, clientId, name, location, objectType (`KASHI_TILE`, `GANCH_PANEL`, `MIXED`), periodStyle, notes, consentFlag, allowExternalAi, status (`DRAFT`, `SOURCES_UPLOADED`, `RECONSTRUCTION_REVIEW`, `DESIGN_APPROVED`, `MODEL_READY`, `PRODUCTION_PLANNED`, `IN_PRODUCTION`, `QC`, `CERTIFIED`, `DELIVERED`, `CANCELLED`).
- **SourceAsset**: ID, projectId, assetType, originalFilename, storageKey, sha256Checksum, sizeBytes, mimeType, magicBytesVerified, calibrationData, createdAt.
- **ReconstructionVersion**: ID, projectId, versionNumber, status (`DRAFT`, `IN_REVIEW`, `APPROVED`, `REJECTED`), approvedByUserId, approvedAt, svgData, heightmapStorageKey, dxfStorageKey, metadataJson.
- **ReconstructionRegion**: ID, versionId, regionIndex, bbox, symmetryCandidate, inpaintCandidate, motifCandidate, chosenCandidate, isApproved.
- **Model3D**: ID, reconstructionVersionId, boundingBoxMm, basePlateThicknessMm, reliefDepthMm, volumeMm3, surfaceAreaMm2, estimatedMassKg, meshStorageKeyGlb, meshStorageKeyStl, meshStorageKeyObj, isWatertight, draftAngleWarningsJson.
- **ParameterSet**: ID, route (`KASHI`, `GANCH`, `CNC_DIRECT`), version, shrinkageX, shrinkageY, shrinkageZ, clayPlasterRecipe, glazeRecipe, firingProfileJson, dryingHours, minThicknessMm, tolerancesJson, isFrozen.
- **JobCard**: ID, pieceId, model3dId, parameterSetId, compensatedDimensionsJson, replicaMarkingRequired, replicaMarkingTextUz, replicaMarkingTextEn, replicaMarkingVerifiedPhotoKey, status.
- **Piece**: ID, serial, projectId, model3dId, status, replicaStatementUz, replicaStatementEn.
- **QCRun**: ID, pieceId, inspectorUserId, expertSignedUserId, result (`PASS`, `FAIL`, `EXPERT_REVIEW`), meanDeltaE, maxDeltaE, scanDeviation95thMm, caliperDeviationsJson, signedAt, expertSignature.
- **Certificate**: ID, serial, pieceId, qcRunId, statementUz, statementEn, canonicalJson, canonicalJsonSha256, expertSignature, status (`VALID`, `REVOKED`), revocationReason, revokedAt.
- **PriceRule**: ID, itemType, basePriceUzs, complexityMultiplier, routeSurchargeUzs, mouldFeeUzs, rushMultiplier, active.
- **Quote**: ID, projectId, subtotalUzs, vatPercent, totalUzs, isEstimate, status.
- **Order**: ID, quoteId, projectId, status, paymentScheduleJson, contractPdfStorageKey.
- **AuditLog**: ID, prevHash, currentHash, timestamp, userId, action, entityType, entityId, payload.
