# Repository Structure

```text
src/
├─ app/                         # routes/pages only
├─ modules/
│  ├─ assistant/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ server/
│  │  └─ index.ts
│  ├─ catalog/
│  ├─ cart/
│  ├─ orders/
│  └─ admin/
├─ shared/
│  ├─ ui/
│  ├─ validation/
│  └─ utils/
├─ core/
│  ├─ auth/
│  ├─ db/
│  ├─ logging/
│  └─ ai/
└─ tests/
   ├─ integration/
   └─ e2e/
```

Rules:
- Route/page là thin shell.
- Module chỉ expose public API qua index.ts.
- Presentational component không fetch data.
- Domain rules không đặt trong component/UI.
