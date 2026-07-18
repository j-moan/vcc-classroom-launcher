# VCC Classroom Launcher

# Architecture Decision Record

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

---

## Decision 011

**Date:** 2026-07-17

### Decision

Separate project loading from the application controller using a dedicated Project Loader.

### Reason

The application should not depend upon the source of project data.

Current projects are loaded from `data.js`, but future implementations may load from:

- project-data.json
- Local Storage
- Cloud Storage
- Database

Changing the project source should not require changes to the remainder of the application.

### Status

Accepted

---

## Decision 012

**Date:** 2026-07-17

### Decision

Separate project validation into two independent validation stages.

### Reason

Structural validation and asset validation solve different problems.

Structural validation verifies project integrity.

Asset validation verifies the availability of referenced resources.

Keeping these responsibilities separate produces simpler code and allows missing assets to generate warnings without preventing Student Mode from operating.

### Status

Accepted

---

## Decision 013

**Date:** 2026-07-17

### Decision

Structural validation errors prevent Student Mode from starting.

### Reason

Projects with invalid hierarchy, navigation, or unsupported data cannot be rendered safely.

Preventing startup avoids undefined behavior and exposes problems immediately.

### Status

Accepted

---

## Decision 014

**Date:** 2026-07-17

### Decision

Missing assets generate warnings rather than errors.

### Reason

Student Mode should continue operating whenever practical.

Missing images, documents, or media should display graceful fallbacks instead of preventing classroom use.

### Status

Accepted

---

## Decision 015

**Date:** 2026-07-17

### Decision

Rendering is divided into specialized renderer modules.

### Reason

Each renderer performs one responsibility.

Current renderers include:

- Layout Renderer
- Navigation Renderer
- Section Renderer
- Content Renderer
- Tile Renderer

This architecture simplifies testing, maintenance, and future expansion.

### Status

Accepted

---

## Decision 016

**Date:** 2026-07-17

### Decision

The Application Controller coordinates the application but does not render user interface elements.

### Reason

Separating application state from rendering reduces coupling and allows rendering behavior to evolve independently.

### Status

Accepted

---

## Decision 017

**Date:** 2026-07-17

### Decision

Teacher Mode will edit a Project Model rather than serialized project data.

### Reason

Editing a Project Model centralizes project integrity, enables undo/redo, simplifies validation, and decouples the editor from the persistence format.

Serialization becomes a separate responsibility.

### Status

Accepted

---

## Decision 018

**Date:** 2026-07-17

### Decision

The serialized project format is independent of the logical Project Model.

### Reason

The Project Model defines the logical classroom structure.

Serialized formats such as JSON exist only to persist Projects.

Future storage mechanisms should not affect the logical Project Model.

### Status

Accepted

---

## Decision 019

**Date:** 2026-07-17

### Decision

Student Mode presents Projects. Teacher Mode creates Projects.

### Reason

Separating presentation from editing provides a clear architectural boundary between the runtime and the editor.

Both applications operate on the same Project Model while performing different responsibilities.

### Status

Accepted

---

## Decision 020

**Date:** 2026-07-17

### Decision

The architecture follows a layered pipeline.

### Reason

Projects move through the application using the following sequence:

```
Project Source
        │
        ▼
Project Loader
        │
        ▼
Structural Validator
        │
        ▼
Asset Validator
        │
        ▼
Application Controller
        │
        ▼
Renderers
```

Each layer performs a single responsibility and communicates only with adjacent layers.

This architecture improves maintainability, testing, and future extensibility.

### Status

Accepted
