# VCC Classroom Launcher

# Development Guide

## Purpose

This document defines the development practices used by the VCC Classroom Launcher.

Unlike the Architecture document, which defines how the application is organized, this guide defines how the project should be developed and maintained.

Its purpose is to ensure that new features are implemented consistently without degrading the architecture or user experience.

---

# Development Philosophy

The project follows a documentation-first development process.

Whenever practical, significant features should be developed in the following order.

1. Identify the problem.
2. Review the existing documentation.
3. Update the appropriate design document.
4. Review and approve the design.
5. Implement the feature.
6. Validate the project.
7. Test normal and failure behavior.
8. Commit the completed work.

Documentation is considered the source of truth.

Code should implement the documented design rather than redefine it.

---

# Documentation Hierarchy

Each document has a specific responsibility.

## Vision.md

Defines the long-term purpose and direction of the application.

---

## Architecture.md

Defines the software architecture.

Responsibilities include:

- System organization
- Runtime architecture
- Teacher Mode architecture
- Publishing architecture
- Deployment architecture

---

## Domain-Model.md

Defines the logical classroom model.

Responsibilities include:

- Project
- Containers
- Layouts
- Layout Entries
- Assets
- Relationships
- Validation rules

---

## UI-Standards.md

Defines the visual and interaction standards used throughout Student Mode and Teacher Mode.

---

## Editor-Design.md

Defines the Teacher editing experience.

---

## Roadmap.md

Defines planned development phases.

---

## Architecture-Decision-Record.md

Records significant architectural decisions and the reasoning behind them.

---

# Development Principles

Every implementation should follow these principles.

## Preserve Separation of Responsibilities

Do not combine unrelated responsibilities into a single component.

Examples include:

- Loading
- Validation
- Rendering
- Editing
- Publishing
- Asset management

Each subsystem should remain focused on one responsibility.

---

## Prefer Extension Over Replacement

Whenever possible:

- Extend existing systems.
- Avoid duplicate implementations.
- Reuse existing dialogs.
- Reuse renderers.
- Reuse actions.
- Reuse asset helpers.

Large architectural rewrites should be rare.

---

## Keep Student Mode Simple

Student Mode should remain focused on presenting classrooms.

Student Mode should never:

- Edit project data
- Modify project structure
- Know where projects are stored
- Know how projects are published

---

## Keep Teacher Mode Focused

Teacher Mode edits the Project Model.

Teacher Mode should not:

- Render Student Mode directly
- Know where published projects are stored
- Contain storage-specific logic

---

## Keep Project Data Independent

Project data should contain logical information only.

Never store:

- Storage paths
- Deployment information
- Runtime state
- Browser-specific information

Project data should remain portable.

---

## Protect Existing Behavior

Working functionality should not regress during refactoring.

Whenever practical:

- Improve structure.
- Preserve behavior.

Refactoring should not change classroom behavior unless that change is intentional.

---

# Asset Guidelines

Application resources and classroom assets serve different purposes.

## Resources

Resources belong to the application.

Examples include:

- Default tile image
- Default header image
- Static interface graphics

Resources are maintained by developers.

---

## Assets

Assets belong to classroom projects.

Examples include:

- Images
- Videos
- PDFs
- PowerPoint presentations

Teacher Mode manages these assets.

---

## Asset References

Project data stores filenames only.

Example:

```text
alphabet.jpg
```

Never store:

```text
assets/images/alphabet.jpg
```

Storage paths are resolved through the asset helper layer.

---

# Validation

Every feature should be tested under both valid and invalid conditions.

Examples include:

- Missing Containers
- Circular hierarchy
- Missing assets
- Invalid navigation
- Disabled Containers
- Unsupported Layout Entry types

Structural failures should prevent Student Mode from starting.

Missing assets should produce graceful fallbacks whenever possible.

---

# Refactoring Guidelines

Refactoring should improve the implementation without changing the architecture.

Before introducing new systems:

- Can an existing subsystem be extended?
- Is this responsibility already owned elsewhere?
- Will this increase long-term complexity?

Whenever practical, choose the simpler implementation.

---

# Testing

New features should be verified in both Student Mode and Teacher Mode when applicable.

Testing should confirm:

- Expected behavior
- Error handling
- Validation
- User workflow
- Recovery from invalid data

Every completed feature should leave the application in a working state.

---

# Source Control

Commits should represent complete, working units of functionality.

Whenever practical:

- Finish one feature before starting another.
- Keep commits focused.
- Use descriptive commit messages.
- Avoid committing partially implemented features.

The Git history should describe the evolution of the project.

---

# Guiding Principles

Every contribution should reinforce the project's core architectural goals.

- Keep the architecture modular.
- Keep responsibilities separate.
- Keep classroom data portable.
- Keep Student Mode simple.
- Keep Teacher Mode approachable.
- Prefer reuse over duplication.
- Preserve compatibility whenever practical.

When uncertain, choose the solution that reduces long-term complexity while preserving the documented architecture.
