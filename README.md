# Ascendra Workspaces

A dashboard for managing developer cloud machines, built for two audiences who don't think about infrastructure the same way: the developers who use the machines, and the DevOps/DevEx admins who run the fleet.

## Running it

```bash
npm install
npm run dev
```

The app opens on the entry screen (`/`), where you choose a persona. There is no real authentication — see **Design assumptions** below.

---

# Part A — Product & UX Thinking

## Understanding the problem

The brief describes one product serving two fundamentally different audiences.

The key requirement isn't simply implementing VM management features, but ensuring that the **Developer** and **Administrator** experiences feel like different products built on the same platform, rather than the same dashboard with different permissions.

---

## Product interpretation

Ascendra Workspaces consists of:

- one application
- one design system
- one shared data model
- two dedicated application shells

Both personas work with the same VM objects, but their goals, navigation, information density, and primary actions differ significantly.

---

## Information Architecture

### Developer

- Entry
- My Machines
- Machine Detail

The Developer experience focuses on quickly checking machine status, connecting, and performing lifecycle actions.

### Administrator

- Entry
- Fleet Overview
- VM Inventory
- Templates

The Administrator experience focuses on monitoring fleet health, utilization, infrastructure cost, and template management.

---

## Design assumptions

- Persona switching replaces authentication to keep the prototype fully explorable without a backend.
- Developer data is scoped to a single fixed owner.
- Running VMs below 15% CPU are marked as **Idle**.
- Infrastructure cost is shown only in the Administrator experience.
- Fleet utilization trends are presented on the Overview page rather than as a separate screen.

---

## Key UX decisions

- Two dedicated application shells rather than a single role-switched dashboard.
- Shared component library and design system across both experiences.
- Developer workflow optimized for frequent operational tasks.
- Administrator workflow optimized for fleet monitoring and rapid diagnosis.
- Sortable, searchable inventory for infrastructure management.
- Strong separation between operational actions and analytical views.

---

## Prioritized user flows

### Developer

Entry

→ Developer

→ My Machines

→ Connect / Start / Stop / Restart

→ Machine Detail (optional)

### Administrator

Entry

→ Admin

→ Fleet Overview

→ VM Inventory

→ Templates

---

## Future improvements

Out of scope for this prototype:

- Real authentication
- User & Team management
- Policies and quotas
- Live updates (polling/WebSockets)
- Extended audit history
- Dark mode

---

# Supporting UX Documentation

The following Miro boards complement this README and document the design process behind the implementation.

## Information Architecture

- Information Architecture (Miro)
  https://miro.com/app/board/uXjVHMdVl74=/?moveToWidget=3458764677384883433&cot=14

## User Flows

- Developer primary flow
  https://miro.com/app/board/uXjVHMdVl74=/?moveToWidget=3458764677385056380&cot=14

- Administrator primary flow
  https://miro.com/app/board/uXjVHMdVl74=/?moveToWidget=3458764677385569891&cot=14

## Product rationale

- Product decisions and UX rationale
  https://miro.com/app/board/uXjVHMdVl74=/?moveToWidget=3458764677385793202&cot=14

These diagrams document the application's information architecture, navigation, product reasoning, and primary user journeys.