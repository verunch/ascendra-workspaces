No analysis repeated here — this is the build spec you execute against. Treat this as your source of truth for the next 6 hours.

---

## 1. Final MVP Scope

**In scope (build these, fully, with states):**

- Developer shell: My Machines (list + lifecycle) + VM Detail
- Admin shell: Fleet Overview (with trend chart folded in) + VM Inventory (with idle flagging + sort-based "distribution") + Templates (create + edit)
- Persona switcher (fake auth substitute)
- Shared data layer: typed mock client + TanStack Query
- Full loading/empty/error/transitional states across all screens
- README with Part A rationale

**Explicitly out of scope (stated, not silently dropped):**

- Real auth
- Policies & quotas
- Users & teams as a standalone screen
- Dark mode
- WebSockets (polling stub only if time allows, otherwise static)
- Per-VM activity log
- Template delete

**Collapsed decision (locked in, don't revisit mid-build):** Fleet Utilization is _not_ a separate screen. Its trend chart lives on Fleet Overview; its distribution requirement is satisfied by sortable utilization columns in VM Inventory. This removes one full screen from your build list without losing rubric coverage.

---

## 2. Exact Screen List

| #   | Screen                         | Shell     |
| --- | ------------------------------ | --------- |
| 1   | My Machines (list)             | Developer |
| 2   | VM Detail                      | Developer |
| 3   | Fleet Overview                 | Admin     |
| 4   | VM Inventory                   | Admin     |
| 5   | Templates (list + create/edit) | Admin     |

**Five screens total.** That's it. Anything you find yourself building beyond this list is scope creep — stop and check this document.

---

## 3. Information Architecture

```
/ (persona switcher / entry)

/app                          [Developer shell]
  /app/machines                — My Machines (default landing)
  /app/machines/:id            — VM Detail

/admin                         [Admin shell]
  /admin/overview               — Fleet Overview (default landing)
  /admin/vms                    — VM Inventory
  /admin/templates              — Templates
```

**Navigation rules:**

- Developer sidebar: single nav item (Machines). Minimal on purpose — devs don't browse, they check status and connect.
- Admin sidebar: three nav items (Overview, VMs, Templates). Fuller, because admins navigate between operational contexts.
- Persona switch is a small, clearly-labeled control (top bar or entry screen) — not a full logout/login flow. One line in README explains it stands in for auth.
- No cross-navigation between `/app` and `/admin` inside the shells themselves — switching is a deliberate, separate action, reinforcing that these are different experiences, not tabs of one app.

---

## 4. Screen Hierarchy

**Developer — My Machines** (entry point, most-used screen)
→ drills into **VM Detail** (one level deep, dead end — only action from here is back or connect/lifecycle)

**Admin — Fleet Overview** (entry point, triage screen, mostly read-only)
→ links out to **VM Inventory** (e.g., "view all VMs" from a stat card) — one-directional pointer, not required, nice if trivial
→ **VM Inventory** and **Templates** are siblings, both reachable directly from sidebar, no further drill-down beneath them (no VM detail page in admin — reuse isn't required for MVP, table row expansion at most if time allows, otherwise skip)

Depth is intentionally shallow everywhere — max two levels. Don't build breadcrumbs; back-button/sidebar is enough at this depth.

---

## 5. What Must Exist on Every Screen

Non-negotiable, applies uniformly to all five screens:

- **Loading state** — skeleton or spinner, not a blank screen
- **Empty state** — real message + icon/illustration-free text is fine, no data ≠ broken screen
- **Error state** — message + retry action, triggered from your mock client's error branch
- **Correct persona shell** — matching sidebar/nav for that shell, no bleed from the other persona's chrome
- **Consistent status/semantic color usage** — same green/gray/amber/red meaning everywhere a status appears
- **Real data from the typed client** — nothing hardcoded in JSX; every number, label, and status comes through TanStack Query

If a screen is missing any of these five when you think you're "done," it isn't done.

---

## 6. What Can Be Omitted

Confirmed cuts, safe to skip without penalty (and say so in README):

- Fleet Utilization as its own page (folded into Overview + Inventory, per §1)
- Template delete action
- Users & Teams screen
- Policies & quotas screen (can stub the nav item as disabled/"coming soon" if trivial, otherwise omit entirely)
- Real-time websocket updates — a static snapshot is fine; polling via `setInterval` is a nice-to-have only if Stage 7 finishes early
- Per-VM activity log / audit trail
- Dark mode
- Keyboard shortcut system beyond standard tab/focus order
- Breadcrumbs, multi-step wizards, confirmation modals for every action (a lightweight inline confirm on stop/restart is enough)

If you're behind schedule, next cuts in priority order: Templates edit → distribution sort in Inventory → VM Detail chart (fall back to static numbers) → connect button styling polish. README time is never cut.

---

## 7. Exact Implementation Order

1. TypeScript domain types + mock data + async client (with configurable delay/error/empty flags)
2. TanStack Query setup + one proof-of-concept query rendering real loading/error state
3. Routing + both shells (sidebar, layout, persona switcher) — screens empty/stubbed at this point
4. Developer: My Machines (list, status badges, lifecycle actions with transitional state)
5. Developer: VM Detail (metadata + usage chart + connect stub)
6. Admin: Fleet Overview (stat cards + trend chart)
7. Admin: VM Inventory (table, search, filter, idle flag, sort)
8. Admin: Templates (list + create/edit form)
9. States sweep across all five screens (loading/empty/error verified by actually triggering each)
10. Accessibility pass (focus states, semantic markup, contrast check)
11. README (Part A rationale + run instructions + omissions)
12. Deploy + final smoke test on the deployed URL

This order is deliberate: data layer and shell before any screen content, because every screen depends on both; README is second-to-last because it should describe what you actually built, not what you planned to.

---

## 8. Time Allocation (6-hour budget)

| Step | Task                                | Time   | Running total |
| ---- | ----------------------------------- | ------ | ------------- |
| 1    | Types + mock data + client          | 30 min | 0:30          |
| 2    | TanStack Query proof-of-concept     | 15 min | 0:45          |
| 3    | Routing + shells + persona switcher | 45 min | 1:30          |
| 4    | My Machines                         | 60 min | 2:30          |
| 5    | VM Detail                           | 30 min | 3:00          |
| 6    | Fleet Overview                      | 45 min | 3:45          |
| 7    | VM Inventory                        | 60 min | 4:45          |
| 8    | Templates                           | 30 min | 5:15          |
| 9    | States sweep                        | 25 min | 5:40          |
| 10   | Accessibility pass                  | 15 min | 5:55          |
| 11   | README                              | 35 min | 6:30          |
| 12   | Deploy + smoke test                 | 15 min | 6:45          |

That totals ~6h45m against a 4-6h target — intentionally slightly over so you have visibility into where to compress. If you're running a strict 5-hour version: cut Step 5's chart to static numbers (-15 min), cut Templates edit (-10 min), compress Step 10 into Step 9 as one combined pass (-10 min), tighten Step 11 to bullet points only (-10 min). That recovers ~45 min.

Checkpoint discipline: if you're not done with Step 4 by the 2:30 mark, stop, reassess, and pre-emptively apply the cut order from §6 rather than discovering the problem at hour 5.

---

## 9. Build Checklist

**Foundation**

- [ ] `VM`, `VMTemplate`, `User`, `FleetUtilization` types defined (adapted from brief, not redesigned)
- [ ] Mock data set: enough VMs (8-12) across statuses, 2-3 templates, 3-4 users, one populated `FleetUtilization` object with trend data
- [ ] Async client with artificial delay + toggleable error/empty modes
- [ ] TanStack Query wired, one query rendering loading → data → (test) error

**Shell**

- [ ] `/app` and `/admin` routes exist, both reachable
- [ ] Developer sidebar: Machines only
- [ ] Admin sidebar: Overview, VMs, Templates
- [ ] Persona switcher functional and visually simple
- [ ] Semantic status colors defined once, reused everywhere (not redefined per screen)

**Developer — My Machines**

- [ ] List renders from query, not hardcoded
- [ ] Status badge per VMStatus value
- [ ] Start/stop/restart mutates state through a visible transitional status
- [ ] Connect button present (stub link acceptable)
- [ ] Empty state (zero VMs) written
- [ ] Error state + retry written

**Developer — VM Detail**

- [ ] Metadata block (template, specs, uptime)
- [ ] CPU/memory usage chart from time-series mock data
- [ ] Connect button present
- [ ] Handles "VM stopped" (no live usage) distinctly from a flat-zero chart
- [ ] Loading/empty/error states written

**Admin — Fleet Overview**

- [ ] Stat cards: total/running/stopped VMs, users, cost
- [ ] One trend chart (CPU + memory over time)
- [ ] Numbers computed from `FleetUtilization`, not literals
- [ ] Loading/empty/error states written

**Admin — VM Inventory**

- [ ] Table with owner, template, status, CPU/mem/disk %
- [ ] Search functional (filters rendered rows)
- [ ] Status filter functional
- [ ] Idle/underused VMs visually flagged
- [ ] Sortable by utilization (covers "distribution" requirement)
- [ ] No-results state for search
- [ ] Loading/empty/error states written

**Admin — Templates**

- [ ] List view (name, CPU, memory, disk, base image)
- [ ] Create form with validated numeric fields
- [ ] Edit form pre-populated from selected template
- [ ] Loading/empty/error states written

**Cross-cutting**

- [ ] Every screen's loading state manually triggered and visually checked
- [ ] Every screen's empty state manually triggered and visually checked
- [ ] Every screen's error state manually triggered and visually checked
- [ ] Focus states visible on all interactive elements
- [ ] Semantic HTML (table for tables, button for buttons, labeled form inputs)
- [ ] Color contrast spot-checked on status badges and body text

**Delivery**

- [ ] README: how to run
- [ ] README: Part A — how brief was read, IA outline, key decisions/trade-offs
- [ ] README: what was omitted and why
- [ ] README: what you'd do next with more time
- [ ] Deployed URL live and smoke-tested (all five screens load without console errors)
- [ ] Repo pushed, link ready to send
