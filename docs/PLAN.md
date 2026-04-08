# Risk Voting System – Implementation Plan

## Context

Build a digital tool for structured, anonymous risk voting in workshops. Facilitators run sessions where participants vote on risks (Impact & Likelihood 1–5), results are analyzed via heatmaps and statistics, and risk owners are assigned with follow-up governance. The repository is empty (greenfield). All UI in English.

**Key design principles:**
- Anonymity must never be circumventable
- Workshop data is locked at publication (immutable snapshots)
- Precision: 2 decimal places, no rounding to integers
- Tool supports decisions – doesn't replace them
- Sequential workshop flow; async follow-up

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 14** (App Router, TypeScript strict) |
| Database | **SQLite** (WAL mode) via **Prisma ORM** – single file, no server needed; can migrate to PostgreSQL later |
| Styling | **Tailwind CSS 4 + shadcn/ui** |
| Real-time | **Socket.IO 4** (rooms per session) |
| Auth | **Session code/link** – no user accounts; facilitator sets a display name; participants join via code |
| Client state | **Zustand** (voting state) + **TanStack Query** (server state) |
| Validation | **Zod** (shared client/server schemas) |
| Heatmap | **Recharts** (custom ScatterChart for 5×5 continuous positioning) |
| Drag & Drop | **@dnd-kit/core + @dnd-kit/sortable** |
| PowerPoint export | **pptxgenjs** |
| Excel export | **ExcelJS** |
| Testing | **Vitest** (unit) + **Playwright** (E2E) |
| Container | **Docker** (optional, single container – no database server needed) |

---

## Project Structure

```
risk1/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout + providers
│   │   ├── page.tsx                            # Landing: create/select project
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   │   ├── route.ts                    # GET list, POST create
│   │   │   │   └── [projectId]/
│   │   │   │       ├── route.ts                # GET/PATCH project
│   │   │   │       ├── risks/
│   │   │   │       │   ├── route.ts            # GET/POST risks
│   │   │   │       │   └── [riskId]/route.ts   # PATCH/DELETE risk
│   │   │   │       └── sessions/
│   │   │   │           ├── route.ts            # GET/POST sessions
│   │   │   │           └── [sessionId]/
│   │   │   │               ├── route.ts        # GET/PATCH session
│   │   │   │               ├── join/route.ts   # POST join via code
│   │   │   │               ├── step/route.ts   # PATCH advance step
│   │   │   │               ├── votes/route.ts  # POST submit votes
│   │   │   │               ├── prescreen/route.ts
│   │   │   │               ├── results/route.ts
│   │   │   │               ├── assignments/route.ts
│   │   │   │               ├── snapshot/route.ts
│   │   │   │               ├── audit/route.ts
│   │   │   │               └── export/
│   │   │   │                   ├── pptx/route.ts
│   │   │   │                   └── xlsx/route.ts
│   │   │   └── socket/route.ts
│   │   ├── projects/
│   │   │   ├── page.tsx                        # Project list
│   │   │   └── [projectId]/
│   │   │       ├── page.tsx                    # Project dashboard
│   │   │       └── sessions/
│   │   │           └── [sessionId]/
│   │   │               ├── page.tsx            # Session hub (redirects to current step)
│   │   │               ├── review/page.tsx     # Step 1: Risk review
│   │   │               ├── prescreen/page.tsx  # Step 1.5: Pre-screening (>30 risks)
│   │   │               ├── vote/page.tsx       # Step 2: Voting
│   │   │               ├── results/page.tsx    # Heatmap + top list
│   │   │               ├── analysis/page.tsx   # Detailed voting analysis
│   │   │               ├── actions/page.tsx    # Risk owners & mitigation
│   │   │               └── governance/page.tsx # Follow-up & LT decisions
│   │   └── join/page.tsx                       # Join session via code
│   ├── components/
│   │   ├── ui/                                 # shadcn/ui primitives
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   └── StepNav.tsx                     # Session step navigation bar
│   │   ├── risks/
│   │   │   ├── RiskCard.tsx
│   │   │   ├── RiskForm.tsx
│   │   │   └── RiskTable.tsx
│   │   ├── voting/
│   │   │   ├── VotingPanel.tsx
│   │   │   ├── VoteButtons.tsx                 # Impact/Likelihood 1-5 button row
│   │   │   ├── VoteProgress.tsx                # Admin: X/Y submitted
│   │   │   └── RiskMatrixPopup.tsx             # Definition reference popup
│   │   ├── results/
│   │   │   ├── Heatmap.tsx                     # 5×5 scatter with continuous positioning
│   │   │   ├── TopRiskTable.tsx
│   │   │   ├── AnalysisTable.tsx               # Per-risk vote distribution
│   │   │   └── SpreadWarning.tsx               # StdDev ≥ 1 indicator
│   │   ├── actions/
│   │   │   ├── AssignmentBoard.tsx             # DnD risk→owner
│   │   │   ├── MitigationForm.tsx
│   │   │   └── ResidualRiskInput.tsx
│   │   ├── governance/
│   │   │   ├── SessionComparison.tsx           # ↑↓→ arrows
│   │   │   └── LTDecisionPanel.tsx
│   │   └── export/
│   │       └── ExportButtons.tsx
│   ├── lib/
│   │   ├── db.ts                               # Prisma client singleton
│   │   ├── socket.ts                           # Socket.IO server setup
│   │   ├── socket-client.ts                    # Socket.IO client hook
│   │   ├── calculations.ts                     # Mean, StdDev, Risk Score, sorting
│   │   ├── anonymity.ts                        # Token generation, hashing, cleanup
│   │   ├── snapshot.ts                         # Immutable snapshot creation
│   │   ├── audit.ts                            # Audit event logger
│   │   ├── export-pptx.ts                      # PowerPoint generation
│   │   ├── export-xlsx.ts                      # Excel generation
│   │   ├── validations.ts                      # Zod schemas
│   │   └── constants.ts                        # Enums, limits, scale definitions
│   ├── hooks/
│   │   ├── useSocket.ts
│   │   ├── useSessionState.ts
│   │   └── useRole.ts
│   ├── stores/
│   │   ├── session-store.ts                    # Current session, step, participants
│   │   └── voting-store.ts                     # Local vote state before submit
│   └── types/
│       └── index.ts
├── server.ts                                   # Custom server: Next.js + Socket.IO
├── tests/
│   ├── unit/
│   │   └── calculations.test.ts
│   └── e2e/
│       └── workshop-flow.spec.ts
├── Dockerfile                                  # Optional, single container
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## Data Model (Prisma Schema)

### Auth Model: Session Code (No User Accounts)

Facilitators create sessions and get a **join code**. Participants visit `/join`, enter the code + a display name, and receive a session-scoped participant token stored in an HTTP-only cookie. No email, no password, no user accounts.

### Entities

**Project**
- `id` (cuid), `name`, `projectType?`, `description?`, `createdAt`, `updatedAt`

**Risk** (belongs to Project)
- `id`, `projectId` (FK), `riskNumber` (Int, auto-increment within project, stable)
- `title`, `description`, `riskType` (Strategic/Operational/External)
- `riskCategory` (People & HR / IT & Cyber / Financial / Legal & Compliance / Environmental & Sustainability / Supplier & Third party / Customer & Market)
- `status` (New/Active/Escalated/Closed)
- `createdAt`, `updatedAt`

**Session** (belongs to Project)
- `id`, `projectId` (FK), `name`, `description?`
- `joinCode` (unique 6-char alphanumeric)
- `currentStep` enum: `RISK_REVIEW | PRE_SCREENING | VOTING | RESULTS | ANALYSIS | ACTIONS | GOVERNANCE | LOCKED`
- `status` enum: `DRAFT | ACTIVE | COMPLETED | LOCKED`
- `createdAt`, `updatedAt`, `lockedAt?`
- `facilitatorName`, `facilitatorToken` (for auth)

**Participant** (session-scoped, no User table)
- `id`, `sessionId` (FK), `displayName`, `role` (FACILITATOR/PARTICIPANT/VIEWER)
- `participantToken` (random UUID, stored in HTTP-only cookie)
- `anonToken` (separate random UUID, used for vote anonymity)
- `joinedAt`
- `@@unique([sessionId, participantToken])`

**SessionRisk** (junction: which risks are in this session)
- `id`, `sessionId` (FK), `riskId` (FK)
- `riskNumber` (Int, session-stable), `included` (Boolean, for pre-screening)
- `@@unique([sessionId, riskId])`

**Vote** (anonymous)
- `id`, `sessionId` (FK), `sessionRiskId` (FK)
- `tokenHash` (SHA-256 of anonToken – NO FK to Participant)
- `impact` (Int? 1-5), `likelihood` (Int? 1-5), `abstained` (Boolean)
- `submittedAt`
- `@@unique([sessionRiskId, tokenHash])`

**PrescreenVote**
- `id`, `sessionId` (FK), `sessionRiskId` (FK)
- `tokenHash`, `include` (Boolean), `submittedAt`
- `@@unique([sessionRiskId, tokenHash])`

**RiskAssignment** (Step: Risk Owners & Actions)
- `id`, `sessionId`, `sessionRiskId` (FK)
- `ownerName`, `ownerEmail?`
- `causeTrigger?`, `timeHorizon?`
- `mitigationStrategy` enum: `Avoid | Mitigate | Transfer | Accept | AcceptWithMonitoring`
- `currentControls?`, `controlEffectiveness?`
- Mitigation actions (JSON array): `[{ description, actionOwner, dueDate, status }]`
- `status` enum: `NotStarted | InProgress | Done | Blocked`
- `residualImpact?` (1-5), `residualLikelihood?` (1-5)
- `earlyWarningIndicators?` (text)
- `@@unique([sessionId, sessionRiskId])`

**LTDecision** (Governance)
- `id`, `riskAssignmentId` (FK)
- `decision` enum: `Accept | AcceptWithMonitoring | AdditionalMitigationRequired | Escalate | Close`
- `decisionDate`, `decisionOwner`, `nextReviewDate?`, `notes?`

**Snapshot** (immutable)
- `id`, `sessionId` (FK), `step`, `version` (Int, auto-increment per session)
- `data` (JSON blob: risk list, aggregated results, participant count)
- `createdAt`
- `@@unique([sessionId, version])`

**AuditEvent**
- `id`, `sessionId?`, `projectId?`
- `action` (e.g. RISK_CREATED, STEP_LOCKED, EXPORT_CREATED)
- `actorRole`, `actorId?` (participant token, NOT anonToken)
- `metadata` (JSON, NEVER contains vote data)
- `timestamp`

---

## Anonymity Architecture

**Critical design**: Votes must NEVER be traceable to individuals.

1. **Token issuance**: When a participant joins, they get a `participantToken` (for session auth) AND a separate `anonToken` (for voting). These are independent random UUIDs.

2. **Vote submission**: Client sends votes using `anonToken`. Server hashes it (SHA-256) to produce `tokenHash` and stores ONLY `tokenHash` in the Vote table. The raw `anonToken` is never stored alongside votes.

3. **No FK from Vote→Participant**: The Vote table has `tokenHash` (string), not a foreign key. No database join can link votes to participants.

4. **Token destruction**: When the voting step is locked, the server NULLs all `anonToken` values in the Participant table. The link is mathematically destroyed – even a DBA cannot recover it.

5. **Unauthenticated vote endpoint**: The POST `/votes` endpoint authenticates via the `anonToken` header, NOT the session cookie. Server logs cannot correlate auth sessions with vote submissions.

6. **Minimum N threshold**: Results are only shown when ≥ 3 non-abstaining votes exist, preventing deduction by elimination.

---

## Calculation Logic

File: `src/lib/calculations.ts`

- **Mean**: `sum(values) / count(values)` – only submitted votes, abstains excluded
- **StdDev**: Population standard deviation on same set
- **Risk Score**: `meanImpact × meanLikelihood` (2 decimal places, NO rounding to integer)
- **Sorting**: Primary: highest risk score → Secondary: higher impact → Tertiary: lower risk number
- **Spread warning**: Show if StdDev ≥ 1.0 AND N ≥ 3 (separate for impact and likelihood)

---

## Real-Time (Socket.IO)

Events scoped to session rooms:

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join-session` | Client→Server | `{ sessionId }` | Join room |
| `vote-progress` | Server→Facilitators | `{ submitted, total }` | Live submission count |
| `step-changed` | Server→Room | `{ step }` | Facilitator advanced step |
| `session-locked` | Server→Room | `{}` | Session locked |
| `risk-updated` | Server→Room | `{}` | Risk list changed, trigger refetch |

---

## Implementation Phases

### Phase 1: Foundation
**Files**: `package.json`, `prisma/schema.prisma`, `server.ts`, `src/app/layout.tsx`, `src/lib/db.ts`, `.env.example`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`

- Initialize Next.js 14 project (TypeScript, Tailwind, ESLint)
- Set up Prisma + SQLite (WAL mode) with full schema
- Create `prisma/dev.db` (auto-created by Prisma migrate)
- Install shadcn/ui base components (button, card, dialog, input, table, tabs, dropdown-menu, badge, tooltip)
- Build root layout with AppShell
- Build landing page (create/select project)
- Create project CRUD (API + pages)
- Session code join flow (facilitator creates session → gets code; participant joins via `/join`)
- Role-based middleware (facilitator vs participant vs viewer)

### Phase 2: Risk Management + Session Flow
**Files**: `src/app/projects/[projectId]/*`, `src/components/risks/*`, `src/components/layout/StepNav.tsx`

- Risk CRUD within a project (API + UI)
- Risk form with all fields (type dropdown, category dropdown, status)
- Risk list page sorted by risk number
- Risk card popup (full details + comments)
- Session creation within a project (selects risks from project catalog)
- StepNav component (horizontal stepper showing all steps)
- Step advancement API (facilitator only, sequential)
- Step lock/unlock logic

### Phase 3: Voting System (Core)
**Files**: `src/app/.../vote/page.tsx`, `src/components/voting/*`, `src/lib/anonymity.ts`, `src/lib/calculations.ts`, `src/stores/voting-store.ts`

- Anonymity layer: token issuance, hashing, vote endpoint
- Voting UI: list of risks with Impact/Likelihood 1-5 button rows
- Abstain option per risk
- Risk matrix definition popup (opens/closes without losing vote state)
- Local vote state management (Zustand)
- Submit flow: validation (warn if missing votes), batch submit, lock
- Re-open before step lock
- Token destruction on step lock
- Calculation engine: mean, stddev, risk score, sorting
- Unit tests for calculations and anonymity

### Phase 4: Pre-screening (>30 risks)
**Files**: `src/app/.../prescreen/page.tsx`, `src/components/voting/PrescreenCard.tsx`

- Yes/No vote on all risks (with abstain option)
- Ranking by "yes" count
- Top 25 selection (with tie handling)
- Results view: ranking, cutoff line, "goes through" / "eliminated" list
- Apply filter to advance only selected risks to voting

### Phase 5: Results & Visualization
**Files**: `src/app/.../results/page.tsx`, `src/app/.../analysis/page.tsx`, `src/components/results/*`

- 5×5 Heatmap (Recharts ScatterChart):
  - Continuous positioning (e.g. 3.40, 2.60)
  - Risks as labeled circles with risk number
  - Color zones (green→yellow→orange→red)
  - Hover tooltips
- Spread warning indicators (⚠ triangle when StdDev ≥ 1 and N ≥ 3)
- Top risk table beside heatmap (risk number, name, score)
- Detailed analysis tables (Impact + Likelihood):
  - Risk number, name, mean, count per 1-5, StdDev, abstain count, N submitted

### Phase 6: Real-Time + Socket.IO
**Files**: `server.ts`, `src/lib/socket.ts`, `src/lib/socket-client.ts`, `src/hooks/useSocket.ts`

- Custom Next.js server wrapping Socket.IO
- Room-based architecture (one room per session)
- Vote progress broadcast (facilitator sees live count)
- Step change broadcast (participants auto-navigate)
- Session lock broadcast
- Connection status indicator in UI

### Phase 7: Risk Owners & Actions
**Files**: `src/app/.../actions/page.tsx`, `src/components/actions/*`

- Two-column layout: owners (with "Unassigned") | risks
- Drag-and-drop risk assignment (@dnd-kit)
- Risk card popup with full action fields:
  - Cause/Trigger, Time horizon
  - Mitigation strategy (dropdown)
  - Current controls + effectiveness
  - Mitigation actions (table: description, owner, due date, status)
  - Residual risk (new impact + likelihood + product)
  - Early warning indicators (free text)

### Phase 8: Follow-up & Governance
**Files**: `src/app/.../governance/page.tsx`, `src/components/governance/*`

- New risks in follow-up sessions (get new risk numbers)
- Session comparison: previous session vs current
  - Arrows: ↑ (increased), ↓ (decreased), → (unchanged)
  - Initial risk vs residual risk comparison
- LT Decision panel per risk:
  - Decision dropdown: Accept / Accept w monitoring / Additional mitigation required / Escalate / Close
  - Decision date, decision owner, next review date
- Project-level persistent view: all sessions, risks, follow-up over time

### Phase 9: Snapshots & Versioning
**Files**: `src/lib/snapshot.ts`, snapshot API routes

- Snapshot creation on step lock (immutable JSON blob):
  - Risk list (all fields), aggregated vote results, participant count
- Version numbering (auto-increment per session)
- Snapshot viewing (historical read-only view)
- Changes after snapshot → new version
- Snapshot data is NEVER modified

### Phase 10: Audit Trail
**Files**: `src/lib/audit.ts`, audit API route

- Event logging for: risk created/changed, step locked/opened, results published, export created
- Each event: role, actor ID (participant token), timestamp, metadata
- NEVER logs vote data or anonTokens
- Audit log viewer page (facilitator only, filterable)

### Phase 11: Export
**Files**: `src/lib/export-pptx.ts`, `src/lib/export-xlsx.ts`, export API routes

- **PowerPoint** (pptxgenjs):
  - Slide 1: Heatmap (rendered as image or SVG)
  - Slide 2: Top risk list table
  - Slide 3+: Analysis tables
- **Excel** (ExcelJS):
  - Tab 1: Impact (one row per risk: risk number, name, Count_1…Count_5, Mean, StdDev, Abstain, N_submitted)
  - Tab 2: Likelihood (same format)
  - NO individual vote rows

### Phase 12: Polish & Testing
- Responsive design refinements
- Error handling and edge cases
- Loading states and skeleton screens
- E2E tests (Playwright): full workshop flow
- Performance testing with 50 risks × 20 participants
- Accessibility audit (keyboard navigation, ARIA labels)

---

## Verification Plan

1. **Unit tests**: `npm run test` – calculations (mean, stddev, risk score, sorting), anonymity (token hashing, destruction)
2. **Integration test**: Create project → add risks → create session → join as participants → vote → verify aggregated results match manual calculation
3. **Anonymity test**: After voting step lock, verify anonTokens are NULLed; verify no DB query can join votes to participants
4. **Real-time test**: Open 2 browser tabs (facilitator + participant), verify vote progress updates live
5. **Export test**: Download PPTX and XLSX, verify format matches spec (column names, decimal precision, no individual rows)
6. **Pre-screening test**: Create session with >30 risks, verify yes/no flow, top-25 selection with tie handling
7. **Snapshot test**: Lock a step, verify snapshot is immutable, modify risk after snapshot, verify new version created
8. **E2E**: `npx playwright test` – full workshop lifecycle from project creation to export
