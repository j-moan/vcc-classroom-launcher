# VCC Classroom Launcher

# Development Guide

## Development Philosophy

The project follows a design-first methodology.

Major features are developed in the following order:

1. Discuss the feature.
2. Update the design documentation.
3. Review the design.
4. Implement the code.
5. Test the feature.
6. Commit to Git with a descriptive message.

Documentation is considered the source of truth.

---

## Source of Truth

Vision.md
Defines the purpose of the project.

Architecture.md
Defines the overall software architecture.

Data-Model.md
Defines the classroom data structure.

UI-Standards.md
Defines the visual standards.

Editor-Design.md
Defines the teacher editing experience.

Roadmap.md
Defines future milestones.

Decisions.md
Records significant architectural decisions.

Git History
Records implementation changes over time.

---

## Coding Standards

- Keep files focused.
- Prefer configuration over hard-coded values.
- Keep application defaults centralized.
- Build for touchscreen first.
- Minimize teacher complexity.
- Never expose technical implementation details to teachers.

---

## Design Principle

Every feature should make the application easier for teachers to use.

If a feature adds complexity without providing meaningful value, it should be reconsidered.
