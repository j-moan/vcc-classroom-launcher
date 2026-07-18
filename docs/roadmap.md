# VCC Classroom Launcher

# Project Roadmap

**Version:** 2.0 (Draft)

**Status:** Current

**Last Updated:** July 2026

---

# Purpose

This roadmap describes the planned evolution of the VCC Classroom Launcher.

The roadmap follows the architectural layering defined in **Software Architecture.md**.

Each phase builds upon the previous phase while keeping the application operational whenever practical.

---

# Phase 1 — Foundation ✅

**Status:** Complete

## Goals

- Git repository
- GitHub Pages
- Development environment
- Single Page Application
- Initial documentation
- Student interface shell
- Header
- Home navigation
- Back navigation

## Deliverable

Working browser application.

---

# Phase 2 — Project Architecture ✅

**Status:** Complete

## Goals

- Container architecture
- Layout architecture
- Navigation model
- Project documentation
- Modular data model
- Student navigation
- Container/Layout rendering

## Deliverable

Stable project architecture.

---

# Phase 3 — Runtime Architecture ✅

**Status:** Complete

## Goals

- Project Loader
- Structural Validator
- Asset Validator
- Modular renderers
- Application controller
- Graceful asset fallback
- Runtime separation of responsibilities

## Deliverable

Stable Student Mode runtime.

---

# Phase 4 — Student Launcher

**Status:** In Progress

## Goals

- YouTube support
- Local video support
- Website support
- PDF support
- PowerPoint support
- Image support
- Information entries
- Responsive layout
- Final student UI polish

## Deliverable

Complete Student Mode suitable for daily classroom use.

---

# Phase 5 — Project Model

**Status:** Planned

## Goals

- Project Model
- Project operations
- Undo-ready architecture
- Editing API
- Serialization model
- Project integrity management

## Deliverable

Editable Project Model independent of storage format.

---

# Phase 6 — Teacher Mode Foundation

**Status:** Planned

## Goals

- Teacher application shell
- Container Tree
- Layout Editor
- Properties panel
- Continuous validation
- Student Preview

## Deliverable

Basic visual editor.

---

# Phase 7 — Asset Library

**Status:** Planned

## Goals

- Image management
- Video management
- Document management
- Presentation management
- Asset picker
- Asset reuse

## Deliverable

Teachers no longer manage classroom assets manually.

---

# Phase 8 — Editing Experience

**Status:** Planned

## Goals

- Drag and drop
- Context menus
- Duplicate
- Copy / Paste
- Undo / Redo
- Keyboard shortcuts
- Search
- Multi-select
- Recent assets
- Favorites

## Deliverable

Highly productive editing environment.

---

# Phase 9 — Project Persistence

**Status:** Planned

## Goals

- project-data.json
- Import Project
- Export Project
- Project serialization
- Project loading
- Multiple projects

## Deliverable

Portable classroom projects.

---

# Phase 10 — Publishing

**Status:** Planned

## Goals

- Publish validation
- Asset verification
- Project generation
- Git integration
- GitHub Pages deployment

## Deliverable

One-click publishing.

---

# Phase 11 — Version 1.0

**Status:** Planned

## Goals

- Classroom testing
- Performance tuning
- Accessibility review
- Documentation review
- Bug fixing
- Final UI polish

## Deliverable

Production-ready classroom platform.

---

# Long-Term Enhancements

Potential future enhancements include:

- Cloud project storage
- Shared classroom libraries
- District deployment
- User accounts
- Classroom templates
- Theme support
- AI-assisted classroom creation
- Analytics
- Multi-language support
- Collaborative editing
- Version history

---

# Current Progress

| Phase                   | Status         |
| ----------------------- | -------------- |
| Foundation              | ✅ Complete    |
| Project Architecture    | ✅ Complete    |
| Runtime Architecture    | ✅ Complete    |
| Student Launcher        | 🔄 In Progress |
| Project Model           | Planned        |
| Teacher Mode Foundation | Planned        |
| Asset Library           | Planned        |
| Editing Experience      | Planned        |
| Project Persistence     | Planned        |
| Publishing              | Planned        |
| Version 1.0             | Planned        |

---

# Guiding Principle

Each phase should leave the project in a working state.

Whenever practical:

- Documentation precedes implementation.
- Validation precedes rendering.
- Architecture precedes features.
- Student Mode remains operational throughout development.
