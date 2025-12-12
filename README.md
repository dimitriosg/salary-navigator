# Salary Navigator

Salary Navigator is a bilingual (English/Greek) salary toolkit built with React, TypeScript, and Vite. It helps employees and employers estimate payroll scenarios for Greece, including gross-to-net conversions, bonuses, employer costs, and yearly tax snapshots.

## Features
- **Payroll calculator:** Switch between gross-to-net and net-to-gross modes, view deductions (EFKA, income tax, solidarity), and account for number of children.
- **Employer cost estimator:** Calculate total employer cost alongside the employee's net pay and contribution split.
- **Yearly summary:** Log monthly gross amounts (with bonuses) to project annual taxes, EFKA contributions, and refund estimates.
- **Seasonal extras:** Dedicated tools for Easter bonus, Christmas bonus, and vacation allowance with prorated calculations.
- **Severance and leave:** Estimate termination compensation and track annual leave entitlement/usage.
- **Language & theme:** Toggle between English/Greek copy and switch themes using the built-in providers.

## Tech stack
- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui (Radix UI primitives) and lucide-react icons
- **State & data:** React Context for language/theme/employment state, TanStack Query for async needs

## Getting started
1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Vite will print the local URL (defaults to `http://localhost:5173`).
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the built app (runs the prestart build automatically):
   ```bash
   npm start
   ```

## Project structure
Key paths you may want to explore:

- `src/pages/` – Route-level views (payroll, employer cost, bonuses, severance, yearly summary, leave balance, 404).
- `src/components/` – Reusable UI and calculators (e.g., `SalaryCalculator`, `EmployerCostCalculator`, `YearlySummary`, navigation shell).
- `src/contexts/` – Cross-cutting providers such as language, theme, and employment data.
- `src/lib/` – Calculation helpers (gross↔net conversions, bonus math, yearly projections, numeric parsing, and formatting utilities).
- `src/components/ui/` – Shadcn-styled primitives (buttons, inputs, cards, etc.).

## Localization
The app ships with English and Greek strings. The language toggle comes from `src/contexts/LanguageContext.tsx`, which exposes a `t(key)` helper used across pages and calculators.

## Linting
Run ESLint to check code style and catch common issues:
```bash
npm run lint
```
