# VCC Classroom Launcher

# Design Decisions

This document records significant architectural and design decisions made during the project.

---

## Decision 001

**Date:** 2026-07-16

**Decision**

Use a Single Page Application (SPA).

**Reason**

Provides fast navigation, no page reloads, and a smoother touchscreen experience.

**Status**

Accepted

---

## Decision 002

**Date:** 2026-07-16

**Decision**

Host the application on GitHub Pages.

**Reason**

Provides free, reliable hosting with version control and a simple publishing workflow.

**Status**

Accepted

---

## Decision 003

**Date:** 2026-07-16

**Decision**

Use an Item-based data model rather than separate Page and Tile objects.

**Reason**

A single Item model simplifies the architecture, editor, drag-and-drop, search, and future expansion. Container items represent pages while other item types perform actions.

**Status**

Accepted

---

## Decision 004

**Date:** 2026-07-16

**Decision**

Each item has exactly one parent.

**Reason**

The classroom structure is a true hierarchy. A single-parent model greatly simplifies navigation, editing, and publishing.

**Status**

Accepted

---

## Decision 005

**Date:** 2026-07-16

**Decision**

Teachers edit the project through a visual editor rather than directly modifying the data model.

**Reason**

The target user is a classroom teacher, not a web developer. The editor should hide technical details such as JSON, file paths, Git, and HTML.

**Status**

Accepted

---

## Decision 006

**Date:** 2026-07-16

**Decision**

The student interface provides only Home and Back navigation.

**Reason**

This keeps navigation predictable and minimizes cognitive load for students.

**Status**

Accepted

---

## Decision 007

**Date:** 2026-07-16

**Decision**

Inactive content remains in the project but is not published to the classroom.

**Reason**

Teachers frequently prepare seasonal or future lessons in advance. Keeping inactive items allows them to be activated later without recreating them.

**Status**

Accepted
