# VCC Classroom Launcher

# Design Decisions

This document records significant architectural and product decisions made during the development of the VCC Classroom Launcher.

Each decision captures **what** was decided, **why** it was chosen, and its current status.

---

## Decision 001

**Date:** 2026-07-17

### Decision

Use a browser-based Single Page Application (SPA).

### Reason

A Single Page Application provides fast navigation, eliminates page reloads, and delivers a smoother experience on classroom touch displays.

### Status

Accepted

---

## Decision 002

**Date:** 2026-07-17

### Decision

Host the application on GitHub Pages.

### Reason

GitHub Pages provides free hosting, version control, a simple publishing workflow, and requires no server-side infrastructure.

### Status

Accepted

---

## Decision 003

**Date:** 2026-07-17

### Decision

Separate the application into two primary data models:

- Containers
- Layout Entries

### Reason

Containers represent classroom pages and define the navigation hierarchy.

Layout Entries define the visual presentation of each page.

Separating structure from presentation results in a simpler editor, cleaner rendering model, and more maintainable architecture.

### Status

Accepted

---

## Decision 004

**Date:** 2026-07-17

### Decision

Represent classroom navigation as a Container Tree.

### Reason

Every Container, except the root Container, has exactly one parent Container.

This produces a true hierarchy that simplifies navigation, editing, publishing, and future expansion.

### Status

Accepted

---

## Decision 005

**Date:** 2026-07-17

### Decision

Each Container owns a single ordered Layout.

### Reason

The Layout defines exactly how the page is rendered.

The rendering engine processes Layout Entries sequentially.

Teacher Mode edits the Layout directly using drag-and-drop.

### Status

Accepted

---

## Decision 006

**Date:** 2026-07-17

### Decision

Navigation Entries are generated automatically from the Container Tree.

### Reason

Teachers manage navigation by editing the Container Tree rather than manually creating navigation tiles.

Navigation Entries may be reordered within the Layout but cannot be created or deleted independently.

### Status

Accepted

---

## Decision 007

**Date:** 2026-07-17

### Decision

Teacher Mode presents two coordinated editing views.

### Reason

The left panel edits the Container Tree.

The right panel edits the Layout of the selected Container.

This mirrors how teachers naturally think about organizing and designing classroom content.

### Status

Accepted

---

## Decision 008

**Date:** 2026-07-17

### Decision

Student Mode provides only Home and Back navigation.

### Reason

Simple, consistent navigation minimizes cognitive load and is appropriate for young learners and special education classrooms.

### Status

Accepted

---

## Decision 009

**Date:** 2026-07-17

### Decision

Containers may be enabled or disabled.

### Reason

Disabled Containers remain visible and editable in Teacher Mode.

Disabled Containers and all of their descendants are hidden and inaccessible in Student Mode.

This allows teachers to prepare future lessons without exposing unfinished content.

### Status

Accepted

---

## Decision 010

**Date:** 2026-07-17

### Decision

Teachers edit projects through a visual editor rather than directly editing project files.

### Reason

The editor hides implementation details such as JSON, HTML, JavaScript, Git, and GitHub, allowing non-technical teachers to build and maintain classroom content confidently.

### Status

Accepted
