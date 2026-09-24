# Story Spec

Story ID: US-LMS-30
Requirement IDs: NFR-LMS-07
Design link: All screens involving critical actions (Grading, Role changes)

Goal:
Ensure important assessment and access-control changes are traceable so the system supports accountability.

Preconditions:
A critical action has occurred: Grade/Feedback saved, User role changed, or other critical event.

Happy path:
1. A critical action (grade save, role update) is performed.
2. System appends an AuditEvent record with: actor_id, action type, target entity, metadata, created_at.
3. Audit record is persisted in an append-only log.
4. Admin or authorized actor can query the audit trail.

Alternate/error paths:
- Audit write fails → critical action is still completed; audit failure is separately logged/alerted.
- Audit log is queried by non-authorized user → 403 Forbidden.

Data read/write:
- Read: AuditEvent (by Admin only)
- Write: AuditEvent (append-only, never update/delete)

API contract:
- Audit is written internally by service layer; no direct API exposed for writes.
- GET `/api/admin/audit?actorId=&action=&from=&to=`
- Response: `[{ id, actorId, action, target, metadata, createdAt }]`

Authorization:
- AuditEvent write: system/service layer (no direct user write).
- AuditEvent read: ADMIN role only.

Validation/business rules:
- AuditEvent is append-only; existing records cannot be modified or deleted.
- Must not store raw secrets, passwords, or full answer content in metadata.
- Actions to trace: grade saved, feedback saved, role changed, reviewer assigned.

Observability/logging:
- Audit IS the observability mechanism for this story.
- Alert on audit write failure.

Test plan:
- Unit test: verify audit record is created on grade save and role change.
- Integration test: admin queries audit log → correct events returned.
- Integration test: non-admin query → 403.
- E2E test: perform grade action → verify audit record exists in admin console.

Definition of Done:
- Audit records are created for all critical actions.
- Records are append-only and cannot be tampered with.
- Admin can query the audit trail.
- Non-admin access is denied.
