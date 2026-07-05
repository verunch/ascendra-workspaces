# Ascendra Architecture

## 1. Assignment Understanding

This is an information-architecture problem disguised as a feature list. The brief (`docs/assignment.md`) hands over a flat bag of features for two personas and explicitly states that the admin and developer experiences "shouldn't be the same screens" — that line is the actual grading hook, not a footnote.

`docs/implementation-plan.md` and `docs/reviewer-analysis.md` (both already in the repo) independently converge on the same scope, which this architecture treats as authoritative rather than re-deriving:

- **Five screens total**, not seven. Fleet Utilization is *not* a standalone page — its trend chart folds into Admin Overview, and its "distribution" requirement is satisfied by sortable utilization columns in VM Inventory.
- **No real auth.** A persona switcher stands in for login, documented as such in the README.
- **Explicitly out of scope** (stated, not silently dropped): Policies & quotas, Users/Teams as a standalone screen, dark mode, WebSockets, per-VM activity log, template delete.
- Every screen must independently prove loading / empty / error / correct-shell states. This is graded explicitly and is where most candidates lose easy points.

## 2. Product Understanding

### Product purpose

Ascendra Workspaces is a dashboard for managing developer machines (cloud VMs), serving two structurally distinct audiences from one coherent design system: developers who use the machines, and DevOps/DevEx admins who manage the fleet.

### Developer persona

- **Mental model**: "my stuff" — one workspace at a time.
- **Primary question**: Is my box on? Can I get in?
- **Primary surface**: Object list + metadata cards.
- **Navigation**: Single nav item (Machines) — devs don't browse, they check status and connect.
- **Density**: Comfort, 48px rows — fewer, richer rows.
- **Shell tone**: Light sidebar, sage accent, primary-forward and calm.

### Administrator persona

- **Mental model**: "fleet health" — the whole organization.
- **Primary question**: Is infra healthy? What's it costing?
- **Primary surface**: Dense tables + trend charts.
- **Navigation**: Three nav items (Overview, VMs, Templates) — admins navigate between operational contexts.
- **Density**: Compact, 36px rows — scanning hundreds of rows.
- **Shell tone**: Dark sidebar (#2B3936), critical-red earns attention for audit/destructive actions.

This split is confirmed structurally, not cosmetically, by the design system's own "Navigation Shells" reference section, which ships two visually distinct shell mockups and a comparison table across exactly these dimensions (mental model, sidebar, density, primary surface, accent usage). The implementation follows that distinction as designed.

## 3. Application Architecture

### Overall architecture

A single-page React application with two route-scoped shells (`/app` for Developer, `/admin` for Admin) sharing one design-token system, one typed mock data layer, and one TanStack Query cache. No backend process — a typed mock client simulates a real API (delay, error, and empty modes) against an in-memory store seeded from `/mock/*.json`.

### Technology stack

- **Vite + React + TypeScript** — fast dev loop, no framework overhead not needed for a 5-screen SPA.
- **Tailwind CSS**, configured with the design system's semantic tokens (`primary`, `primary-tint`, `success/warning/danger/info`, `bg/surface/border/text/text-muted`, spacing scale 4/8/12/16/24/32/48/64, radius 3/6/10, shadow-0..3) as `theme.extend` values — not raw hex scattered through components.
- **shadcn/ui** for primitives (Button, Input, Select, Dialog, Tabs, Table, Badge, Card, Skeleton, Sonner/toast) — used as a base, restyled via the token config so it reads as this design system, not default shadcn.
- **TanStack Query** as the entire server-state layer — no Redux/Zustand for server data.
- **React Router** for the two-shell route split.
- **Recharts** (or equivalent lightweight charting library) for utilization line/trend charts.

### Architectural principles

- Don't hardcode data inside components — every number, label, and status comes through the typed mock client via TanStack Query.
- The developer/admin distinction must be structural (different shells, different information architecture, different default views), not a re-skinned table with a role toggle.
- Prefer simple, production-quality solutions; no unnecessary abstractions, no premature global state.
- Every data surface defines its loading, empty, and error states — not just the happy path.
- Follow the design system as the visual source of truth, translated into components — never copy its HTML.

## 4. Folder Structure

```
src/
  app/                    # bootstrapping
    App.tsx
    providers.tsx         # QueryClientProvider, PersonaProvider
    router.tsx
  routes/                 # route-level pages — thin, orchestrate hooks + layout
    entry/                # "/" persona switcher
    developer/
      MachinesPage.tsx
      MachineDetailPage.tsx
    admin/
      OverviewPage.tsx
      InventoryPage.tsx
      TemplatesPage.tsx
  layouts/
    DeveloperShell.tsx     # light sidebar, single nav item, comfort density
    AdminShell.tsx         # dark sidebar, 3 nav items, compact density
  components/
    ui/                    # shadcn primitives (generated, lightly themed)
    shared/                 # cross-persona composed components
    developer/
    admin/
  api/
    client.ts               # delay/error-simulating fetch wrapper
    store.ts                 # in-memory mock DB seeded from /mock
    vms.ts  templates.ts  users.ts  fleet.ts
  hooks/                    # TanStack Query hooks (useVms, useVmLifecycle, ...)
  types/                     # VM, VMTemplate, User, FleetUtilization, Policy
  lib/                       # cn(), formatters, idle-threshold logic
  styles/globals.css
```

## 5. Routing Strategy

```
/                              persona-switcher entry (default landing)
/app                           [Developer shell]
  /app/machines                — My Machines (default)
  /app/machines/:id             — VM Detail
/admin                          [Admin shell]
  /admin/overview                — Fleet Overview (default)
  /admin/vms                      — VM Inventory
  /admin/templates                 — Templates
```

No cross-navigation between `/app` and `/admin` inside the shells — switching personas is a deliberate top-level action (a small control on the entry screen / top bar), not a tab. Depth is intentionally shallow: max two levels anywhere, no breadcrumbs needed.

## 6. Layout Architecture

Two shell components, sharing the same token set but structurally distinct per the design system's own shell reference:

### Developer Shell

- White sidebar, 256px wide.
- Sage (`primary-tint`) active-state highlight.
- Single nav item (Machines).
- Comfort-density content: 48px rows / generous card padding.
- Content is metric-card and chart-forward.

### Admin Shell

- Dark sidebar (`#2B3936`), 264px wide.
- White text, active items on `primary-700`.
- Three grouped nav items (Overview, VMs, Templates).
- Compact-density content: 36px rows.
- Content is table-forward with a breadcrumb-style context line.

### Shared layout elements

- A shared top-bar slot for page title + one primary action per view.
- Both shells cap content width appropriately for the 1280–1920px range and never introduce horizontal scroll on the page — tables get their own `overflow-x-auto` container instead.
- Semantic status colors (running/stopped/starting/error, idle flags) are defined once and reused identically in both shells — never redefined per screen.

## 7. Data Flow

### Mock API layer

A thin typed mock client, not MSW/json-server — a module-level in-memory store seeded from `/mock/*.json`, wrapped in async functions with artificial delay and toggleable error/empty flags. This satisfies "don't hardcode data" and "handle loading/error/empty as if real" without infrastructure overhead disproportionate to a 5-screen app.

### TanStack Query

The entire server-state layer. Queries: `useVms`, `useVm(id)`, `useTemplates`, `useUsers`, `useFleetUtilization`. Each query surfaces `isLoading` / `isError` / `data` states directly to its screen.

### Data fetching

Every screen consumes data exclusively through its TanStack Query hook — nothing hardcoded in JSX. Loading and error branches are toggleable in the mock client so every screen's three non-happy-path states can be manually triggered and visually verified.

### Mutations

Mutations: `useVmLifecycle` (start/stop/restart), `useCreateTemplate`, `useUpdateTemplate` — each invalidates the relevant query key on settle. VM lifecycle transitions (running → stopping → stopped, etc.) are simulated *inside the mock client* with a timed two-phase resolve (immediate transitional status, then terminal status after a delay), so the UI shows a real "starting…" state without client-side polling hacks.

### Error handling

Errors surface through TanStack Query's error state into a shared `ErrorState` component (message + retry action), triggered from the mock client's error branch. Retrying re-fires the query. No screen may silently swallow an error into a blank view.

## 8. State Management

### TanStack Query

Owns all server state: VMs, templates, users, fleet utilization, and the pending/success/error status of lifecycle mutations. This is the single source of truth for anything that originates from the mock backend.

### React Context

Owns **persona** only (`developer` | `admin`), backed by a small Context + localStorage. This is client-only UI state, orthogonal to server data, and doesn't belong in the query cache.

### Local component state

Owns anything scoped to a single screen and not shared: VM Inventory's search/filter/sort state, Templates' create/edit form state. These don't need to be global or synced to the mock client, and lifting them would be unnecessary abstraction for a 5-screen app.

**Why this split**: server data changes based on network/mock-client resolution and needs caching, dedup, and invalidation — that's TanStack Query's job. Persona is small, cross-cutting, and rarely changes — Context is the right weight. Table/form interaction state is local, high-frequency, and screen-specific — global state here would only add indirection without benefit.

## 9. Component Hierarchy

**My Machines** → `DeveloperShell` → `MachinesPage` → `MachineList` → `MachineRow` (`StatusBadge`, `UtilizationBar` ×3, `ConnectButton`, `LifecycleControls`) + `EmptyState` / `ErrorState` / `Skeleton` siblings gated on query status.

**VM Detail** → `DeveloperShell` → `MachineDetailPage` → `MachineMetaPanel` + `UsageChart` (CPU/mem lines) + `ConnectButton` + `LifecycleControls`.

**Fleet Overview** → `AdminShell` → `OverviewPage` → `MetricCard` ×5–6 (total/running/stopped VMs, users, cost) + `FleetTrendChart` (CPU+mem, single chart, small legend).

**VM Inventory** → `AdminShell` → `InventoryPage` → `SearchInput` + `StatusFilter` + `VmInventoryTable` (`StatusBadge`, `UtilizationBar`, idle-flag chip) + `EmptyState` (no results) / `ErrorState` / `Skeleton`.

**Templates** → `AdminShell` → `TemplatesPage` → `TemplateList` (`TemplateCard`/row) + `TemplateForm` (create/edit, shared component, Dialog-hosted).

## 10. Reusable Components

### Cross-persona (`components/shared/`)

- **StatusBadge** — VMStatus → label + dot + color. Status is never color-only, per the design system's rule that every chip pairs a hue with a dot/glyph and a text label.
- **UtilizationBar** — track + fill + tabular-nums percentage, color thresholds (≥90 danger / ≥70 warning / else neutral), matching the design system's sortable table treatment.
- **MetricCard** — KPI value with label, used for stat rows.
- **UsageChart** / **FleetTrendChart** — thin single chart (Recharts), muted palette, barely-there gridlines.
- **EmptyState** — icon-free message + affordance, per the design system's empty-state pattern.
- **ErrorState** — message + retry action.
- **LoadingSkeleton** — shimmer, layout-preserving so nothing jumps when data lands.
- **PersonaSwitcher** — small, clearly-labeled control; one line in the README explains it stands in for auth.

### Developer-specific

- **ConnectButton** — primary CTA, stub link to a vscode-server-style URL.
- **LifecycleControls** — start/stop/restart, disabled/spinner mid-transition.

### Admin-specific

- **VmInventoryTable** — searchable/filterable/sortable table with idle flagging.
- **TemplateForm** — shared create/edit form with validated numeric fields.

## 11. Design System Integration

The design system (`design-system/index.html`) is the visual source of truth but is never copied directly — it is a static reference document, not application code. Translation into React proceeds as follows:

- **Tokens first.** All color, spacing, radius, elevation, and typography values documented in the design system's "Design Tokens" section are captured as semantic Tailwind `theme.extend` entries (`primary`, `primary-tint`, `primary-subtle`, `success`, `warning`, `danger`, `info`, `bg`, `surface`, `border`, `text`, `text-muted`; spacing 4/8/12/16/24/32/48/64; radius 3/6/10/full; shadow-0..3) rather than referenced as raw hex in components. `design-system/tokens.json` is empty, so these values are hand-extracted from the rendered HTML and become the source of truth going forward.
- **Typography**: IBM Plex Sans (body) + IBM Plex Mono (numbers, IDs, metrics), the type scale (11/12/13/15/16/19/24/34), and the tabular-nums rule for all numeric columns and KPI values are applied globally, not per-component.
- **Component primitives** (buttons, inputs, badges, tabs, dialogs) are built on shadcn/ui and restyled through the token config so sizing (sm 28px / md 36px / lg 44px controls), radius, and focus-ring behavior (1px border shift + 3px ring, never color alone) match the design system exactly.
- **Tables** follow the design system's rules directly: numeric columns right-aligned and monospaced, status as a labelled chip (never color-only), zebra off by default, sticky header on scroll, full-row hover target.
- **Two shells** are implemented as distinct layout components (`DeveloperShell`, `AdminShell`) reflecting the design system's own two-shell reference — light/dark sidebar, comfort/compact density, different primary surfaces — rather than one shell with conditional styling.
- **Charts** follow the "muted, palette-derived" rule: thin strokes, subtle area fill only where shown in the reference, gridlines barely visible, critical red reserved for negative/error series only.
- No HTML/inline styles from the design system are ported as-is; every visual pattern is re-expressed as a typed, reusable React component consuming the token set.

## 12. Risks and Assumptions

- **Idle threshold** isn't numerically specified in the brief — it will be defined explicitly (e.g., no meaningful CPU for N minutes past `lastActiveAt`) and the chosen number stated in the README, not buried in code.
- **`vmMetrics[]` missing from `mock/fleet-utilization.json`** — the suggested `FleetUtilization` type includes this array but the actual mock data omits it. VM Inventory will compute per-VM CPU/mem/disk metrics directly from `mock/vms.json` instead, which already carries that data per VM. This will be restated in the README.
- **`design-system/tokens.json` is empty** — token values are hand-extracted from the rendered HTML (hex codes, scale, radii all confirmed inline in the design system document); the Tailwind config becomes the source of truth going forward.
- **Cost roll-up** (hourly → month-to-date → projected) isn't specified beyond the mock's precomputed numbers — the app will display `fleet-utilization.json`'s given values as-is rather than re-deriving a formula that could contradict the mock.
- **Biggest time risk**: the VM Inventory table (search + filter + sort + idle-flag) and the Templates form are historically where builds like this overrun. The accepted fallback cut order, if time runs short, is: Templates edit → Inventory distribution sort → VM Detail chart (fall back to static numbers) → Connect-button styling polish.
- `design-system/support.js` was intentionally not analyzed — it is a proprietary rendering shim for the design-system document itself (custom `<x-dc>` / `sc-for` tags), not part of the target stack, and irrelevant to implementation.

## 13. Implementation Roadmap

| # | Milestone | Est. | Done when |
|---|---|---|---|
| 1 | Types + mock client + store + Tailwind token config | 40m | `useQuery` against mock client renders real loading→data, error toggle works |
| 2 | Routing + both shells (empty screens) + persona switcher | 45m | All 6 routes reachable, shells visually distinct per §6 |
| 3 | Developer: My Machines (list, status, lifecycle) | 60m | Every VMStatus has a treatment; start/stop/restart moves through a visible transitional state |
| 4 | Developer: VM Detail (metadata + chart + connect) | 30m | Chart renders from real mock time-series, not static SVG |
| 5 | Admin: Fleet Overview (stat cards + trend chart) | 40m | Numbers computed from `FleetUtilization`, not literals |
| 6 | Admin: VM Inventory (table, search, filter, idle flag, sort) | 60m | Filtering/search actually filters via state; idle VMs visually flagged |
| 7 | Admin: Templates (list + create/edit) | 30m | Create updates the list; edit pre-populates |
| 8 | States sweep + a11y pass (loading/empty/error, focus, contrast) | 35m | Every one of the 5 screens' three states manually triggered and checked |
| 9 | README (Part A rationale, run instructions, omissions) + deploy | 40m | Stranger could clone, run, and understand decisions in under 5 minutes |

Total ≈ 6h, matching the assignment's time box, with the cut order from §12 as the release valve if any milestone overruns.
