# VCC Classroom Launcher

# Development Guide

## Development Philosophy

The project follows a design-first methodology.

Major features are developed in the following order:

1. Discuss the feature.
2. Review the relevant source-of-truth documents.
3. Update the design documentation.
4. Review and approve the design.
5. Implement the code.
6. Validate the project structure and assets.
7. Test normal behavior and failure behavior.
8. Commit to Git with a descriptive message.

Documentation is considered the source of truth.

Implementation should follow the documented architecture rather than redefining it informally in code.

---

## Source of Truth

### Vision.md

Defines the purpose, intended users, and product direction.

### Architecture.md

Defines the software architecture, system layers, and component responsibilities.

### Domain-Model.md

Defines the logical classroom Project, including Containers, Layouts, Layout Entries, Assets, and validation rules.

Until the file is renamed, this document may remain as `Data-Model.md`.

### UI-Standards.md

Defines Student Mode visual and interaction standards.

### Editor-Design.md

Defines the Teacher Mode editing experience.

### Roadmap.md

Defines planned development phases and milestones.

### Architecture-Decision-Record.md

Records accepted architectural and product decisions.

### Git History

Records implementation changes over time.

---

## Coding Standards

- Keep files focused.
- Give each module one clear responsibility.
- Prefer configuration over hard-coded values.
- Keep application defaults centralized.
- Build for touchscreen use first.
- Minimize teacher complexity.
- Never expose technical implementation details to teachers.
- Keep project loading, validation, application control, rendering, editing, and persistence separate.
- Do not allow Student Mode to modify project data.
- Teacher Mode must modify projects through the Project Model rather than directly mutating serialized data.
- Keep renderers focused on presentation rather than validation or application state.
- Treat structural validation errors as blocking.
- Treat missing assets as warnings when the application can continue safely.
- Prefer graceful fallbacks over broken interface elements.
- Preserve working behavior during refactoring.
- Keep the application operational after each implementation phase whenever practical.

---

## Validation and Testing

Every meaningful feature should be tested in both valid and invalid conditions.

Examples include:

- valid project data
- missing Containers
- invalid parent-child relationships
- circular hierarchy
- unsupported Layout Entry types
- missing images
- missing content targets
- disabled Containers
- navigation to inaccessible descendants

Structural failures should stop Student Mode safely.

Asset failures should produce warnings and graceful fallbacks whenever possible.

---

## Architectural Boundaries

The application is divided into distinct responsibilities:

```text
Project Source
      ↓
Project Loader
      ↓
Structural Validator
      ↓
Asset Validator
      ↓
Application Controller
      ↓
Renderers
```
