# Source structure

This project uses a role-based LMS structure aligned with the Project Vault requirements.

```text
src/
├─ app/
│  ├─ auth/
│  │  └─ login/
│  ├─ learner/
│  │  ├─ dashboard/
│  │  ├─ courses/
│  │  ├─ lessons/
│  │  ├─ assignments/
│  │  └─ submissions/
│  ├─ instructor/
│  │  ├─ dashboard/
│  │  └─ submissions/
│  ├─ reviewer/
│  │  └─ dashboard/
│  ├─ admin/
│  └─ state-lab/
├─ modules/
│  ├─ auth/
│  ├─ users/
│  ├─ courses/
│  ├─ lessons/
│  ├─ assignments/
│  ├─ submissions/
│  ├─ reviews/
│  ├─ ai-tutor/
│  ├─ admin/
│  └─ dashboard/
├─ shared/
│  ├─ ui/
│  ├─ validation/
│  └─ utils/
├─ core/
│  ├─ auth/
│  ├─ db/
│  ├─ logging/
│  └─ ai/
├─ tests/
│  ├─ integration/
│  └─ e2e/
└─ README.md
```

Rules:
- app/ contains only route/page shells.
- modules/ expose public API through index.ts.
- component UI is presentational and does not fetch data.
- business rules live in domain/service logic, not in UI.
