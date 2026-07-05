# Data Model

## Purpose

This document describes the primary entities used by the Ascendra Workspaces application and their relationships.

The JSON files located in `/mock` are the single source of truth for mock data.

---

# Core Entities

## Users

Represents application users.

Typical roles:

- Developer
- Administrator

Users can own one or multiple virtual machines.

---

## VM Templates

Reusable virtual machine configurations.

Templates define the default configuration used when creating new VMs.

Typical properties include:

- Operating System
- CPU
- Memory
- Storage
- Region
- Base Image

---

## Virtual Machines (VMs)

Represents active or inactive cloud workspaces.

Each VM:

- belongs to a user
- is created from a VM Template
- has its own runtime state
- contributes to fleet metrics

Possible states include:

- Running
- Stopped
- Starting
- Error

---

## Policies

Represents governance rules applied to virtual machines.

Examples:

- Auto Shutdown
- Idle Timeout
- Cost Limits
- Compliance Rules
- Security Policies

Policies may affect one or many virtual machines.

---

## Fleet Utilization

Aggregated infrastructure metrics.

Contains system-wide information such as:

- Total VMs
- Running VMs
- Idle VMs
- CPU Utilization
- Memory Utilization
- Estimated Cost
- Overall Fleet Health

---

# Relationships

User
↓
Virtual Machine

VM Template
↓
Virtual Machine

Policy
↓
Virtual Machine

Virtual Machines
↓
Fleet Utilization

---

# Expected UI Usage

Users
→ User Management
→ Ownership information

VM Templates
→ Template Library
→ Create Workspace

Virtual Machines
→ Dashboard
→ VM Table
→ Workspace Details

Policies
→ Policy Management
→ Compliance

Fleet Utilization
→ Dashboard Metrics
→ Charts
→ Health Overview

---

# Edge Cases

The UI should gracefully support:

- VM without owner
- Offline VM
- VM in Error state
- Missing utilization metrics
- High resource consumption
- Policy violations
- Empty states
- Loading states
- API failures

---

# Design Principle

The interface should visualize relationships between Users, Virtual Machines, Policies and Fleet metrics while keeping navigation simple and enterprise-focused.
