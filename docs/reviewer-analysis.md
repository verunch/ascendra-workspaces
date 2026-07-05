# Reviewing the Ascendra Workspaces Take-Home

Good brief to dissect — it's deliberately loose in the way real PM tickets are. Let's go through this like a mentor would before you write a single line of code.

---

## 1. What's Actually Being Evaluated

**Explicit requirements** (stated in the doc): two personas, core feature lists for each, mock backend, TypeScript, charts, README, deployed URL.

**Implicit expectations** (not stated, but assumed of a senior candidate):

- That you recognize this is an **information architecture problem disguised as a feature list**. The brief gives you a flat bag of features; nobody told you how navigation, role-switching, or layout should work. That's the actual test.
- That you can **scope down** without being told to. The "core" list is still too much for 4-6 hours if you build it all with full polish. Knowing what to cut _and saying so_ is the signal.
- That your code reads like it was written by someone who's shipped production dashboards before — not a tutorial project. Consistent patterns, sensible folder structure, typed API boundaries.
- That you understand **enterprise B2B SaaS density and tone** — not a consumer-app aesthetic. Tables, not cards, for inventory. Numbers that align. No decorative gradients.

**Hidden evaluation criteria** (what actually moves the needle, even though it's not in the rubric table verbatim):

- **Judgment under ambiguity** is graded more than feature count. The "How We Evaluate" table literally lists "Requirement interpretation" first. They will read your README before they click around.
- **Restraint.** A reviewer doing 20 of these take-homes is allergic to over-engineering (auth systems, fake multi-tenant orgs, websocket infra) because it signals you don't know how to triage. Time-boxed over-delivery reads as a yellow flag, not a green one, because it suggests poor judgment about a 4-6h box translating to poor judgment about real sprints.
- **Whether the developer/admin distinction is structural or cosmetic.** Many candidates will reskin the same table with a different color. The brief explicitly says "shouldn't be the same screens" — that line is a trap for the lazy approach (e.g., one VM table with a role toggle). They want to see you actually understood that devs think in terms of "my stuff" and admins think in terms of "fleet health," which implies different default views, different primary metrics, possibly different navigation paradigms (sidebar vs persona-switch).
- **Whether your charts mean anything.** "Data visualization: not overwhelming" — they're watching for chart-as-decoration vs. chart-as-answer-to-a-question.

---

## 2. Critical Analysis of the Assignment

**Ambiguous requirements you must resolve yourself:**

- _Authentication / role switching_: Is this one logged-in user who happens to be an admin, viewing two areas? Or two separate login experiences? The brief says "developers login... DevOps need visibility" — doesn't specify whether one account can hold both roles.
- _Navigation between developer and admin_: Same app, route-based split? Or entirely separate apps/subdomains? The brief hints they should feel different but doesn't say how someone _gets_ between them (if they even should).
- _"Idle" definition_: not specified numerically. You'll need to invent a threshold (e.g., no CPU activity above X% for Y minutes) for the "surface idle/underused VMs" requirement.
- _Cost model_: hourly cost is given per VM but how it rolls up to month-to-date/projected isn't specified — you're expected to just compute it sensibly from the mock data.
- _Real-time vs static_: "modern and fast" plus mock backend — they don't actually expect live infra, but do expect the _appearance_ of liveness (loading skeletons, optimistic UI on start/stop) without you over-investing in WebSockets.

**Assumptions you'll need to explicitly state (and should, in the README):**

- Single mock org, single logged-in admin and single logged-in developer (probably toggled via a dev-only switcher in your app, not real auth) — this is almost certainly what's expected, not a real login flow.
- A fixed roster of templates/VMs is fine; you don't need CRUD-everywhere, just template create/edit as specified.
- "Browser IDE" connect button can be literally a stub link/button with no real backend — explicitly permitted in the brief.

**Product decisions intentionally left undefined** (this is where you differentiate):

- How prescriptive the admin view should be (just dashboards, or does it nudge action — "5 idle VMs costing $X/mo, stop them?"). Doing the latter shows product thinking, not just CRUD building.
- Whether developer and admin are two routes in one app (`/app` vs `/admin`) or two distinct shells with their own nav/sidebar look. I'd argue for **one codebase, two distinct shells** — reuse the design system/tokens, but different layout components, different default landing pages, different primary nav items. That satisfies "obviously different" without requiring two separate apps (which would blow your time budget).

**Risks / common mistakes candidates make on this exact brief:**

1. **Building auth.** Huge time sink, zero evaluation value — the brief never asks for it. Common trap.
2. **Treating "developer vs admin" as a single VM table with a role filter.** Technically meets the literal feature list, completely misses the "shouldn't be the same screens" instruction.
3. **Charting everything possible** instead of 2-3 charts that answer "is infra healthy" and "is my VM ok." Overwhelm is explicitly penalized.
4. **Skipping states.** Loading/empty/error are graded explicitly — easy points many candidates drop because they only build the happy path.
5. **Spending hours on a fake backend with full CRUD persistence** instead of a thin typed mock client. They want to see a _data layer pattern_ (typed client + TanStack Query), not a real database.
6. **No README rationale**, or a README that's just setup instructions. The rubric's first row is "requirement interpretation" — if you don't write it down, they can't grade it even if you privately thought it through.
7. **Policies/Users/teams (stretch items) built at the expense of core.** Don't touch stretch goals until core (both personas) is fully solid with proper states.

---

## 3. The Strongest MVP for a 4–6 Hour Box

**Must implement (non-negotiable, this is literally "core" in the brief):**

_Developer:_

- My Machines list (status, template, live-looking usage %)
- Start/stop/restart with a visible transitional state ("starting…")
- Connect button (stub)
- One VM detail page with usage-over-time chart + metadata

_Admin:_

- Fleet overview (the ~6 headline metrics)
- VM inventory table, searchable/filterable, with idle/underused visibly flagged
- One fleet utilization chart (trend) + one distribution view (e.g., a sorted bar list or simple scatter of VMs by utilization — doesn't need to be fancy)
- Templates list + create/edit form

**Can safely be omitted** (say so explicitly in README, don't silently drop):

- Policies & quotas — mention you'd add this next, maybe stub the nav item as "coming soon" if you want to show you thought about IA without building it.
- Users & teams as its own page — you can satisfy "number of users" in fleet overview without a full user management screen.
- Real websockets — fake it with `setInterval` polling against your mock layer, that's enough to look "live."
- Dark mode — nice-to-have, skip unless everything else is done with time to spare.
- Per-VM activity log — skip; usage chart + metadata covers the detail page requirement.

**Highest value-per-hour, in order:**

1. The data layer (typed client + TanStack Query + proper loading/error/empty UI) — graded explicitly as its own row, and it's reused by every screen, so building it right early pays off everywhere.
2. The two distinct shells/IA — this is the crux of "requirement interpretation," graded first.
3. States handling (loading/empty/error/transitional) — cheap to do if your data layer is right, explicitly graded, frequently skipped by others.
4. README rationale — close to zero build time, disproportionately weighted because it's literally how they grade "communication" and "requirement interpretation."
5. Charts — but only 2-3 well-chosen ones, not a chart for every metric.

I'd push back gently on one instinct you might have: don't be tempted to make the admin "Templates create/edit" form fancy. It's listed as core, but it's the least interesting screen in the whole assignment from an evaluation standpoint — a clean, simple form is enough. Don't gold-plate it.

---

## 4. Execution Plan (time-boxed)

Assume 6 hours total. I'm front-loading architecture because every screen depends on it.

**Stage 0 — Setup & data modeling (30 min)**

- Objective: scaffold project, define TS domain types, set up mock data + a thin async client (MSW or static JSON behind a fake-latency async function), wire TanStack Query.
- Output: working `npm run dev` with one dummy query rendering on screen.
- Done when: a component can call `useQuery` against your mock client and show real loading/error states by toggling a flag.

**Stage 1 — IA & shell (45 min)**

- Objective: decide and build the two shells — nav structure for developer vs admin, routing, a way to switch persona (e.g., a simple top-left switcher, framed as "for demo purposes" in a tooltip/README note — don't pretend it's real auth).
- Output: two empty but navigable layouts with distinct nav.
- Done when: you can route between `/app/machines`, `/app/machines/:id`, `/admin/overview`, `/admin/vms`, `/admin/templates` and the two shells are visually distinct (not just a color swap).

**Stage 2 — Developer: My Machines + lifecycle (60 min)**

- Objective: VM list with status, template, usage; start/stop/restart with optimistic/transitional UI.
- Output: functioning list, mutations update status through "starting" → "running" etc., ideally with a short artificial delay so the transition is visible.
- Done when: every VMStatus value has a clear visual treatment, and a stop/start actually moves through the state machine.

**Stage 3 — Developer: VM detail (30 min)**

- Objective: metadata panel + CPU/memory usage-over-time chart, connect button stub.
- Output: one detail route working off mock historical data.
- Done when: chart renders from real (mock) time-series data, not hardcoded SVG.

**Stage 4 — Admin: Fleet overview (45 min)**

- Objective: headline metric cards + one trend chart.
- Output: cards pulling from `FleetUtilization`, one line/area chart for CPU+memory over time.
- Done when: numbers are computed from the mock dataset, not literals in JSX.

**Stage 5 — Admin: VM inventory (60 min)**

- Objective: searchable/filterable table, idle/underused flagged visibly (badge or sort-to-top), owner column resolved from `User`.
- Output: full table with at least search + status filter + an "idle" indicator.
- Done when: filtering/search actually filters the rendered rows via state, not just UI mockup.

**Stage 6 — Admin: Templates (30 min)**

- Objective: list + simple create/edit form/modal.
- Output: form with validated fields mapped to `VMTemplate`.
- Done when: creating a template updates the list (can be client-side mock-state, doesn't need real persistence).

**Stage 7 — States, polish, a11y pass (45 min)**

- Objective: make sure every list/detail screen has loading skeleton, empty state, error state with retry; check focus states and contrast.
- Output: toggle-able error/empty conditions in your mock client to verify visually.
- Done when: you've actually triggered each state once and seen it render correctly, not just written the code path.

**Stage 8 — README + deploy (45 min)**

- Objective: write Part A rationale, run instructions, what's omitted/what's next; deploy (Vercel/Netlify).
- Output: README.md + live URL.
- Done when: a stranger could clone, run, and understand your decisions in under 5 minutes of reading.

**Buffer: ~30-40 min** for whatever overruns (it will be the table or the form, it's always the table or the form).

If you're tracking toward 6 hours and Stage 6 isn't done, cut the _edit_ half of templates and keep _create only_ — still satisfies the literal requirement ("create/edit one") defensibly if you note the trade-off.

---

## 5. Screen-by-Screen Review

**Developer — My Machines**

- _Purpose_: let a developer see and control their own VMs at a glance.
- _Primary user_: engineer, daily, probably checking "is my box on" or "let me get into it."
- _Primary actions_: connect/open IDE, start/stop/restart.
- _Information hierarchy_: status first (visually, via color/icon), then name/template, then usage — usage is secondary here because devs care about "is it running" more than "how loaded is it" (that's the admin's job).
- _Critical UI_: status badge with clear state language, primary connect CTA (should look like the default action, not buried in a menu), lifecycle controls.
- _Optional_: per-VM cost (devs probably don't need to see $/hr — that's an admin concern; including it clutters the dev view and muddies the persona distinction).
- _Edge cases_: zero VMs (empty state with a clear "request/create a VM" affordance, even if non-functional), a VM in "error" status, a VM mid-transition where buttons should be disabled/show spinner not silently re-clickable.

**Developer — VM Detail**

- _Purpose_: deeper look at one machine — is it healthy, what is it, how do I get in.
- _Primary user_: engineer, occasional, usually after noticing something off in the list.
- _Primary actions_: connect, maybe restart from here too.
- _Information hierarchy_: identity/metadata (template, specs, uptime) above the fold, usage chart as the visual centerpiece, lifecycle controls accessible but secondary to "connect."
- _Critical UI_: CPU/memory time-series chart, metadata table.
- _Optional_: disk usage chart (disk is slower-moving, a simple bar/percentage is enough, doesn't need its own line chart).
- _Edge cases_: VM stopped (no live usage data — show "VM is stopped" instead of a flat zero line, which is misleading), no historical data yet (newly created VM).

**Admin — Fleet Overview**

- _Purpose_: answer "is the infrastructure healthy and what's it costing us" in under 5 seconds.
- _Primary user_: DevOps/DevEx admin, daily check-in.
- _Primary actions_: mostly read-only — this is a landing/triage screen, not a workflow screen; the action is "decide where to look next" (inventory, templates).
- _Information hierarchy_: counts (total/running/stopped VMs, users) as scannable top-row stat cards, utilization and cost as the meatier visual section below.
- _Critical UI_: stat cards, one trend chart for utilization, one cost figure (hourly + monthly projected) prominently placed since cost is the thing admins get asked about by their boss.
- _Optional_: peak vs avg utilization as a secondary stat — useful but don't let it compete visually with the primary numbers.
- _Edge cases_: zero VMs running (e.g., all stopped overnight) shouldn't read as an error state, just a quiet "0 running."

**Admin — VM Inventory**

- _Purpose_: operational table for finding and acting on specific VMs across the org.
- _Primary user_: DevOps admin investigating cost/waste or a specific user's complaint.
- _Primary actions_: search, filter (by status/owner/idle), sort by utilization.
- _Information hierarchy_: owner and status are the scan columns, utilization columns next, with idle/underused visually flagged (badge or row-tint) since the brief explicitly calls this out as something to "surface clearly."
- _Critical UI_: the idle indicator — this is the one piece of "insight," not just data, in this screen; don't let it get lost as just another column.
- _Optional_: per-row quick actions (stop an idle VM directly from the table) — nice if time allows, not required.
- _Edge cases_: search with no results, a VM with no owner resolvable (data integrity edge case worth handling gracefully rather than crashing).

**Admin — Fleet Utilization**

- _Purpose_: trend and distribution view — is utilization stable, trending up, or are there hot/idle outliers.
- _Primary user_: DevOps admin doing capacity planning or investigating a cost spike.
- _Primary actions_: read/interpret, maybe change time period (real-time/24h/30d) if you have time, otherwise hardcode one period and say so.
- _Information hierarchy_: trend chart (time) as primary, distribution (which VMs are hot/idle) as secondary — could literally be the inventory table sorted by utilization rather than a separate visualization if you're tight on time. **Honestly**, I'd consider merging this into the Fleet Overview + Inventory rather than building a third distinct page — the brief's "fleet utilization" requirement can be satisfied by a trend chart on Overview plus the idle-flagging in Inventory, saving you a whole screen's worth of time without losing any rubric points.
- _Edge cases_: flat/no data period.

**Admin — Templates**

- _Purpose_: define the VM "menu" developers can provision from.
- _Primary user_: DevOps admin, infrequent (setup-time task, not daily).
- _Primary actions_: view list, create, edit.
- _Information hierarchy_: name + specs (CPU/mem/disk) as scan columns, base image and preinstalled tools as secondary detail.
- _Critical UI_: simple list + a form (modal or inline) with validated numeric fields.
- _Optional_: usage count ("12 VMs use this template") — nice touch showing relational thinking, skip if short on time.
- _Edge cases_: deleting a template in use (don't build delete unless trivial — brief only asks for view/create/edit).

---

## 6. Visual Design Direction

Goal: calm, enterprise, data-dense-but-legible, "Linear/Vercel-dashboard" register rather than "consumer app."

- **Typography**: a single neutral sans (Inter, or system-ui stack) at 14px base for tables/body — enterprise dashboards run smaller than marketing sites because density matters. Use weight (500/600) rather than size jumps for hierarchy in tables, reserve larger sizes (20-28px) only for page titles and the big stat-card numbers.
- **Spacing system**: 4px base unit (4/8/12/16/24/32). Tight, consistent gutters — 8px between related elements (label/value), 16-24px between distinct sections. Don't let dashboard cards float in oceans of whitespace; density signals "tool," not "landing page."
- **Corner radius**: small and consistent — 6-8px for cards/buttons/inputs, 4px for badges/chips. Avoid the very rounded "soft SaaS" look; it reads consumer, not infra-admin.
- **Shadows**: minimal. A single subtle elevation token for cards (e.g. `0 1px 2px rgba(0,0,0,0.06)`), nothing heavier. Borders (1px, low-contrast neutral) do more work than shadows in this register — flat with hairline borders reads more "enterprise tool" than floating cards.
- **Color**: neutral gray scale as the base (backgrounds, borders, body text), one accent color used sparingly for primary actions/links, and a small fixed semantic palette for status: green (running/healthy), gray (stopped), amber (starting/transitional/idle-warning), red (error). Reuse these exact semantic colors identically in both dev and admin views — consistency here signals it's one coherent system, not two bolted-together apps.
- **Tables**: left-align text, right-align numbers, monospace or tabular-nums for percentages/costs so columns line up, sticky header on scroll, generous but not loose row height (~40-44px), zebra striping optional/subtle — hairline row dividers are usually enough.
- **Cards**: used for stat summaries and grouped metadata, not for repeating list items (lists/tables stay tabular, don't card-ify a VM list — that's a common "looks modern" mistake that actually hurts scannability at this density).
- **Charts**: one consistent line-chart style for trends (CPU/memory), thin strokes (1.5-2px), no heavy gradients/fills unless used very subtly under the line for area emphasis, gridlines barely-there, tooltips on hover rather than always-visible data labels. Keep both metrics (CPU/mem) in one chart with a small legend rather than two separate charts where it's reasonable, to reduce visual count.
- **Navigation**: persistent left sidebar for both shells — but differ them clearly: e.g., developer sidebar might be compact/minimal (Machines, maybe nothing else — devs don't need much nav), admin sidebar is fuller (Overview, Inventory, Templates, [Policies — stub]). The _content and icon set_ differing, not just a relabeled identical sidebar, is what sells "distinct experience."
- **Density**: comfortable-dense — this is a daily-use tool, not a marketing dashboard. Err toward showing more data per screen with tight but legible spacing rather than the airy, oversized-stat-card look common in dashboard templates.

---

## 7. Minimal Documentation for Part A

Don't build a Figma file, don't build a full IA diagram tool output. The brief explicitly says a short README section is enough. I'd recommend exactly these, in this order, in the README:

1.  **A short "How I read the brief" paragraph** — 3-5 sentences naming the core tension (dev = "my stuff," admin = "fleet health") and your resulting structural decision (two shells, shared design system).
2.  **A simple text-based IA outline** — not a diagram, just nested bullets:
    This alone demonstrates IA thinking with near-zero time cost.
        ```
        /app (developer)  /machines  /machines/:id/admin  /overview  /vms  /templates
        ```
3.  **A short "Key decisions & trade-offs" list** — 5-8 bullets, each one decision + one line of reasoning (e.g., "Merged fleet-utilization trend into Overview rather than a separate page — avoids a thin screen, keeps the 'is infra healthy' answer in one place").
4.  **A "What I left out / what's next" list** — explicitly naming policies, users/teams, dark mode, websockets as consciously deferred, not forgotten. This is pure signal for almost no cost — write it last, after you know what you actually cut.

Skip: user flow diagrams, persona documents, competitive analysis, a written design system spec. None of that is asked for and all of it eats hours for no rubric credit.

---

## 8. How I'd Personally Run the 6 Hours

Pragmatically, I would not start by thinking about visual design at all — I'd start by writing the TypeScript types and mock data layer almost verbatim from the brief's suggested shapes (they basically handed you the schema; don't redesign it, just use it, that's free time saved). Then I'd build the IA/shell skeleton before any real screen content, because that's the thing being evaluated first and it's also the thing every other screen depends on architecturally.

I'd timebox myself ruthlessly using the stage plan above with a phone timer, and I would protect Stage 7 (states/a11y) and Stage 8 (README) no matter what — I would rather ship Templates with create-only and no edit, or collapse Fleet Utilization into Overview, than arrive at hour 6 with five gorgeous screens and a happy-path-only README-less repo. The rubric rewards a smaller, _complete-feeling_ slice over a larger incomplete one, and completeness here means "every screen has loading/empty/error," not "every brief bullet has a screen."

If I noticed at hour 3 that I was behind, my cut order would be: drop Templates edit → drop the Fleet Utilization distribution visual (fold into Inventory sort) → drop the VM detail chart in favor of static sparkline numbers → never cut README time.

One thing I'd push back on if you were tempted toward it: don't add a fake login screen "to make it feel real." It's tempting because it feels like polish, but it's pure time-sink with zero rubric weight — a simple persona switcher with a one-line README note ("auth is out of scope; toggle below simulates dev vs admin login") gets you the same evaluative credit for a fraction of the cost.
