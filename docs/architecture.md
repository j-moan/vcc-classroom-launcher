# VCC Classroom Launcher

# Architecture

**Version:** 2.0 (Draft)

**Status:** Current

**Last Updated:** July 2026

---

# Purpose

This document defines the software architecture of the VCC Classroom Launcher.

It describes how the application is organized, how its major components interact, and the architectural principles that guide future development.

This document is intentionally implementation-independent wherever practical. Individual JavaScript files may change over time, but the architectural responsibilities defined here should remain stable.

---

# Scope

This document covers:

- Student Mode architecture
- Teacher Mode architecture
- Runtime architecture
- Project loading
- Validation
- Rendering
- Project persistence
- Future architectural direction

Implementation details, user interface standards, and data definitions are documented separately.

---

# Design Goals

The architecture is designed around the following goals.

## Simple

The system should remain understandable by a single developer.

Complexity should be introduced only when it provides measurable value.

---

## Reliable

Student Mode must continue operating whenever possible.

Invalid projects should be detected before rendering.

Missing assets should degrade gracefully without crashing the application.

---

## Fast

The classroom should load quickly.

Navigation should occur instantly without reloading the browser.

Rendering should require only the currently displayed Container.

---

## Modular

Each subsystem should have one responsibility.

Subsystems should communicate through well-defined interfaces rather than direct dependencies.

---

## Data Driven

Student Mode should contain no hard-coded classroom content.

Everything displayed to students originates from project data.

---

## Easy to Maintain

New features should require modification of only a small portion of the application.

Existing modules should rarely require modification when new functionality is added.

---

## Teacher Friendly

Teachers should eventually manage classroom content entirely through Teacher Mode.

Editing project files directly should never be required.

---

# Architectural Principles

The architecture follows several fundamental principles.

## Single Responsibility

Every major component performs one job.

Examples include:

- Project Loader loads projects.
- Validators validate.
- Renderers render.
- Teacher Mode edits.
- The Project Model manages project state.

---

## Separation of Concerns

The following concerns remain independent:

- project storage
- project editing
- validation
- rendering
- application control
- presentation

Each layer communicates only with adjacent layers.

---

## Composition Over Duplication

The system avoids duplicated information whenever possible.

For example:

Navigation Entries reference Containers.

Navigation labels are automatically obtained from the referenced Container rather than being duplicated inside the Layout.

---

## Validation Before Rendering

Projects are validated before rendering begins.

Structural problems prevent Student Mode from starting.

Asset problems generate warnings but do not prevent classroom use whenever reasonable.

---

## Progressive Enhancement

The architecture supports future capabilities without requiring significant redesign.

Examples include:

- cloud storage
- multiple classroom projects
- undo / redo
- project import/export
- collaborative editing

---

# Glossary

## Project

A complete classroom definition.

A Project contains all Containers, assets, metadata, settings, and relationships required to render a classroom.

---

## Container

A Container represents one rendered classroom page.

Containers form the navigation hierarchy.

Containers own Layouts.

---

## Layout

A Layout is an ordered collection of Layout Entries.

The Layout defines presentation order only.

It does not define hierarchy.

---

## Layout Entry

A Layout Entry represents one visible object displayed within a Container.

Examples include:

- Navigation
- Section
- Video
- Website
- PDF
- Image
- Information

---

## Student Mode

Student Mode presents an already-defined classroom.

It never edits project data.

---

## Teacher Mode

Teacher Mode edits a classroom Project.

Teacher Mode modifies the Project Model rather than directly editing serialized project data.

---

## Project Model

The Project Model is the editable representation of a classroom.

Teacher Mode performs all modifications through the Project Model.

The Project Model is responsible for maintaining project integrity.

---

# Current Architecture

The application currently consists of the following major layers.

```
Browser
    │
index.html
    │
Project Loader
    │
Structural Validator
    │
Asset Validator
    │
Application Controller
    │
Layout Renderer
 ┌─────┼─────────┐
 │     │         │
 ▼     ▼         ▼
Navigation  Section  Content
 Renderer   Renderer Renderer
        \      |      /
         \     |     /
          ▼    ▼    ▼
         Tile Renderer
```

Each layer performs a single responsibility.

Each layer communicates only with adjacent layers.

The runtime never edits project data.

---

# Current Runtime Pipeline

The runtime currently performs the following sequence.

```
Project Source
      │
      ▼
Project Loader
      │
      ▼
Structural Validation
      │
      ▼
Asset Validation
      │
      ▼
Application Startup
      │
      ▼
Container Rendering
      │
      ▼
User Interaction
```

Once startup has completed, Student Mode operates entirely in memory.

No additional project loading occurs during normal navigation.

---

# Core Architecture

The VCC Classroom Launcher is built around three primary concepts:

- Containers
- Layouts
- Layout Entries

Together these form the complete classroom definition.

The application itself never stores classroom content outside of this structure.

---

## Containers

A Container represents one rendered classroom page.

Containers form the navigation hierarchy of the classroom.

Each Container has exactly one parent, except the root Container.

Containers own all information required to render a page.

Typical Container properties include:

- title
- subtitle
- parent
- active state
- child Container list
- layout
- page metadata

Containers are responsible for hierarchy.

Containers are **not** responsible for presentation.

---

## Container Hierarchy

Containers form a strict tree.

```
Home
│
├── Reading
│    ├── Phonics
│    └── Stories
│
├── Math
│
└── Morning Meeting
      ├── Calendar
      └── Songs
```

Every Container has:

- zero or one parent
- zero or more child Containers

Circular relationships are not permitted.

---

## Active Containers

Containers may be enabled or disabled.

When disabled:

- Teacher Mode continues to display the Container.
- Student Mode cannot navigate to the Container.
- Descendants are also inaccessible.

Disabling a Container never deletes its contents.

---

# Layout

Every Container owns exactly one Layout.

The Layout defines presentation order.

The Layout does **not** define hierarchy.

A Layout is simply an ordered collection.

Example:

```
Navigation
Navigation
Section
Video
Website
Section
PDF
Information
```

Items appear on screen in the same order they exist within the Layout.

---

## Layout Entries

Every visible object displayed inside a Container is represented by one Layout Entry.

Current entry types include:

- Navigation
- Section
- Video
- Website
- PDF
- PowerPoint
- Image
- Information

Additional Layout Entry types may be added without changing the overall architecture.

---

## Navigation Entries

Navigation Entries connect one Container to one direct child Container.

Navigation Entries do not own the destination.

Instead they reference an existing child Container.

```
Parent Container
      │
      ▼
Navigation Entry
      │
      ▼
Child Container
```

Navigation labels are automatically derived from the referenced Container title.

This prevents duplicate information from existing in multiple locations.

---

## Sections

Sections are Layout Entries.

A Section represents a visual break within a page.

Sections:

- span the page width
- may include a heading
- may include descriptive text
- do not participate in navigation

Sections affect presentation only.

---

## Content Entries

Content Entries represent classroom resources.

Examples include:

- YouTube video
- Local video
- Website
- PDF
- PowerPoint
- Image
- Information card

Each content type stores only the information required to launch or display that resource.

---

# Runtime Components

The runtime is intentionally divided into small modules.

Each module performs one responsibility.

---

## index.html

Provides the permanent application shell.

Examples include:

- application header
- navigation buttons
- content area
- message area

No classroom content is hard-coded into the HTML.

---

## Project Loader

Responsible for obtaining a Project.

Current implementation loads the project from:

```
data.js
```

Future implementations may load from:

- project-data.json
- Local Storage
- Cloud Storage
- Database

The remainder of the application does not depend upon the project source.

---

## Structural Validator

Responsible for validating project integrity.

Examples include:

- valid Container hierarchy
- valid parent relationships
- valid child relationships
- supported Layout Entry types
- cycle detection
- navigation consistency

Structural validation occurs before Student Mode starts.

Validation failures prevent application startup.

---

## Asset Validator

Responsible for validating referenced assets.

Current validation includes:

- image existence

Future validation may include:

- PDF availability
- presentation availability
- local video availability
- external URL verification

Asset validation generates warnings.

Missing assets should not prevent Student Mode from operating whenever practical.

---

## Application Controller

The Application Controller coordinates runtime behavior.

Responsibilities include:

- application startup
- project loading
- validation workflow
- navigation
- application state
- content actions
- message display

The Application Controller does not directly create user interface elements.

---

## Renderers

Renderers convert validated project data into browser elements.

Current renderers include:

- Layout Renderer
- Navigation Renderer
- Section Renderer
- Content Renderer
- Tile Renderer

Renderers contain presentation logic only.

They do not perform validation.

They do not modify project data.

---

## Tile Renderer

The Tile Renderer provides the reusable visual component used throughout Student Mode.

All tile types share:

- consistent sizing
- consistent styling
- consistent interaction
- consistent image handling

Missing images automatically display a placeholder rather than producing a broken interface.

---

# Navigation

Navigation is entirely Container-based.

Student Mode never navigates directly to Layout Entries.

Navigation sequence:

```
Current Container
        │
Navigation Entry Selected
        │
Referenced Child Container
        │
Render Child Container
```

The Home button always returns to the root Container.

The Back button returns to the parent Container.

No browser page reload occurs during navigation.

---

# Error Handling

The application distinguishes between structural failures and runtime warnings.

## Structural Errors

Examples:

- missing Container
- invalid hierarchy
- circular references
- unsupported Layout Entry type

Structural errors prevent Student Mode from starting.

---

## Asset Warnings

Examples:

- missing image
- missing PDF
- unavailable local media

Asset warnings are reported to the developer.

Whenever possible, Student Mode continues operating using graceful fallbacks.

---

# Module Dependencies

Dependencies intentionally flow in one direction.

```
Project Source
        │
        ▼
Project Loader
        │
        ▼
Validators
        │
        ▼
Application Controller
        │
        ▼
Renderers
        │
        ▼
Browser
```

Lower layers never call upward into higher layers.

This keeps the architecture modular and simplifies future testing and replacement of individual components.

---

# Teacher Mode Architecture

Student Mode is responsible for presenting an existing classroom.

Teacher Mode is responsible for creating and maintaining classroom projects.

Teacher Mode is implemented as a separate application layer that edits a Project rather than directly manipulating serialized project data.

The runtime and the editor share the same Project structure, validators, and rendering rules.

---

## Teacher Mode Goals

Teacher Mode is designed to allow non-technical teachers to create and maintain classroom content without editing code.

Teacher Mode will support:

- Creating Containers
- Editing Container properties
- Organizing the Container hierarchy
- Creating Layout Entries
- Reordering Layout Entries
- Managing classroom assets
- Validating projects
- Previewing Student Mode
- Publishing classroom projects

---

## Teacher Mode Architecture

```
Teacher Interface
        │
        ▼
Project Model
        │
        ▼
Validation
        │
        ▼
Project Serialization
        │
        ▼
Project Storage
```

Each layer performs one responsibility.

The Teacher Interface never edits serialized project data directly.

---

# Project Model

The Project Model is the editable representation of a classroom project.

It exists only while the project is open.

Teacher Mode performs every modification through the Project Model.

Typical operations include:

- Create Container
- Delete Container
- Rename Container
- Move Container
- Enable Container
- Disable Container
- Add Layout Entry
- Remove Layout Entry
- Move Layout Entry
- Modify Properties
- Import Assets
- Export Project

The Project Model is responsible for maintaining project integrity.

---

## Validation During Editing

Validation is integrated into the editing workflow.

Teacher Mode validates projects continuously rather than waiting until publishing.

Validation categories include:

### Structural Validation

Examples:

- hierarchy
- parent relationships
- navigation integrity
- duplicate identifiers
- circular references

Structural problems prevent publishing.

---

### Asset Validation

Examples:

- missing images
- missing documents
- unavailable presentations
- missing local media

Asset problems generate warnings but do not necessarily prevent publishing.

---

# Project Persistence

The runtime should remain independent of the storage mechanism.

Current implementation:

```
data.js
```

Planned implementation:

```
project-data.json
```

Possible future implementations include:

- Local projects
- Cloud projects
- Shared classroom libraries
- District repositories

Changing the storage mechanism should not require changes to the runtime architecture.

---

## Project Serialization

Teacher Mode will save Projects by serializing the Project Model.

```
Project Model
      │
      ▼
project-data.json
```

Loading performs the reverse operation.

```
project-data.json
      │
      ▼
Project Model
```

Serialization should be isolated within the Project Loader and Project Persistence layers.

---

# Asset Management

Teacher Mode will eventually include an Asset Library.

The Asset Library will manage:

- Images
- Local videos
- Documents
- Presentations
- Future media types

Layout Entries reference assets rather than embedding asset data directly.

---

# Student Preview

Teacher Mode will include a live Student Preview.

The preview uses the same rendering pipeline as Student Mode.

```
Project Model
       │
       ▼
Validation
       │
       ▼
Renderer
       │
       ▼
Preview
```

This guarantees that the preview accurately reflects the published classroom.

---

# Deployment

Current deployment workflow:

```
VS Code
      │
      ▼
GitHub Desktop
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Pages
```

Future publishing may additionally support exporting portable classroom projects without requiring GitHub.

---

# Implementation Status

| Component                 | Status   |
| ------------------------- | -------- |
| Container Architecture    | Complete |
| Layout Architecture       | Complete |
| Student Mode              | Complete |
| Modular Renderers         | Complete |
| Project Loader            | Complete |
| Structural Validator      | Complete |
| Asset Validator           | Complete |
| Missing Asset Placeholder | Complete |
| Project Model             | Planned  |
| Teacher Mode              | Planned  |
| Asset Library             | Planned  |
| JSON Project Format       | Planned  |
| Import / Export           | Planned  |
| Student Preview           | Planned  |
| Publish Validation        | Planned  |
| Cloud Storage             | Future   |
| Collaborative Editing     | Future   |

---

# Future Evolution

The architecture is intentionally layered so future capabilities can be added without redesigning the application.

Planned enhancements include:

- Project Model
- Teacher Mode
- Visual Container Tree Editor
- Visual Layout Editor
- Asset Library
- JSON project persistence
- Import / Export
- Student Preview
- Publish Validation
- Multiple classroom projects

Potential long-term enhancements include:

- Cloud synchronization
- Shared classroom libraries
- District-wide deployment
- User accounts
- Collaborative editing
- Version history

These features should be implemented by extending existing architectural layers rather than replacing them.

---

# Summary

The VCC Classroom Launcher architecture separates the application into independent layers responsible for:

- Project loading
- Project validation
- Asset validation
- Application control
- Rendering
- Project editing
- Project persistence

Each layer performs a single responsibility.

This separation allows the application to evolve from a static classroom launcher into a complete classroom authoring system while preserving the existing runtime architecture.

The guiding principle of the architecture is:

> **Student Mode presents Projects. Teacher Mode creates Projects.**
