# VCC Classroom Launcher

# Architecture

## Purpose

This document defines the software architecture of the VCC Classroom Launcher.

It describes how the application is organized, how its major systems interact, and the architectural principles that guide future development.

Unlike implementation files, this document describes responsibilities rather than specific source files. JavaScript modules may evolve over time, but the responsibilities defined here should remain stable.

This document focuses on _how_ the application is organized rather than _what_ it displays.

---

# Architectural Goals

The architecture is designed around several primary goals.

## Simplicity

The application should remain understandable by a single developer.

Complexity should only be introduced when it provides measurable long-term value.

Whenever possible:

- One responsibility
- One implementation
- One location

is preferred over clever or highly abstract designs.

---

## Reliability

Student Mode should remain operational whenever practical.

Invalid classroom projects should be detected before rendering begins.

Missing assets should degrade gracefully rather than preventing classroom use.

Errors should be isolated whenever possible.

---

## Maintainability

The application should evolve by replacing individual systems rather than redesigning the entire application.

Future enhancements should require modifying as few existing components as possible.

---

## Modularity

Every major subsystem should have one primary responsibility.

Examples include:

- Loading
- Validation
- Rendering
- Editing
- Publishing
- Asset management

Subsystems should communicate through clearly defined interfaces rather than directly manipulating each other's internal implementation.

---

## Data Driven

Student Mode should never contain hard-coded classroom content.

Everything displayed to students originates from project data.

Teacher Mode exists to modify project data rather than modify the runtime.

---

## Storage Independence

Project data should remain independent of where it is stored.

The application should not assume projects originate from:

- GitHub
- Local Storage
- Local files
- Cloud storage
- A classroom server

Storage implementations should be replaceable without changing the rest of the application.

---

# Architectural Principles

The VCC Classroom Launcher follows several fundamental architectural principles.

---

## Single Responsibility

Every subsystem should perform one clearly defined job.

Examples include:

- Project Loader loads projects.
- Validators validate projects.
- Renderers create user interface.
- Actions launch classroom content.
- Teacher Mode edits projects.
- Publishing distributes projects.

Responsibilities should not overlap.

---

## Separation of Concerns

The following concerns remain independent:

- Project editing
- Project storage
- Project loading
- Validation
- Rendering
- Asset management
- Publishing
- User interface

Each layer communicates only with adjacent architectural layers.

---

## Composition Over Duplication

Information should exist in one location whenever practical.

For example:

Navigation Entries reference Containers.

Navigation labels are obtained from the referenced Container rather than duplicated inside Navigation Entries.

This minimizes synchronization problems and simplifies editing.

---

## Data Before Presentation

Project data defines classroom content.

Renderers determine how that content appears.

Changing presentation should not require changing project data.

Changing project data should not require changing presentation code.

---

## Implementation Hiding

Subsystems should expose simple interfaces while hiding implementation details.

Examples include:

Asset helper functions determine where assets are stored.

Renderers do not need to know storage locations.

Publishing does not need to know how editing works.

Teacher Mode does not need to know how rendering works.

---

## Graceful Degradation

Whenever practical, failures should produce usable behavior rather than application failure.

Examples include:

- Missing images display the default tile resource.
- Missing classroom pages are skipped.
- Missing documents generate classroom-friendly messages.
- Asset validation produces warnings rather than preventing application startup.

---

## Evolution Without Rewrite

The architecture should allow individual systems to evolve independently.

Examples include:

- Replacing Local Storage
- Adding cloud publishing
- Hosting on a classroom Mini-PC
- Supporting multiple teachers

These enhancements should replace individual architectural layers rather than requiring redesign of the application.

---

# Core Concepts

Everything within the application is built around a small number of core concepts.

---

## Project

A Project represents an entire classroom.

A Project contains:

- Containers
- Layouts
- Layout Entries
- Classroom metadata
- Relationships
- Classroom settings

The Project contains all information required to present a classroom experience.

---

## Container

A Container represents one classroom page.

Containers define classroom hierarchy.

Each Container owns:

- Page information
- Layout
- Metadata
- Navigation relationships

Containers define navigation.

They do not define presentation.

---

## Layout

Every Container owns exactly one Layout.

A Layout is an ordered collection of Layout Entries.

Layouts define presentation order only.

They do not define hierarchy.

---

## Layout Entry

Every visible object displayed on a page is represented by one Layout Entry.

Current entry categories include:

- Navigation
- Section
- Video
- PDF
- Website
- Image
- PowerPoint
- Information
- Placeholder

Additional entry types should be added without requiring architectural redesign.

---

## Student Mode

Student Mode presents an existing classroom.

Student Mode never edits project data.

Student Mode is responsible only for:

- Navigation
- Rendering
- Launching classroom content
- Presenting messages

---

## Teacher Mode

Teacher Mode edits classroom projects.

Teacher Mode never manipulates serialized project data directly.

Instead it edits the Project Model.

---

## Project Model

The Project Model is the editable representation of a classroom.

Teacher Mode performs every modification through the Project Model.

The Project Model is responsible for maintaining project integrity while editing.

---

# System Architecture

The application is organized into several major systems.

```
Published Project Source
        │
        ▼
Project Loader
        │
        ▼
Validation
        │
        ▼
Application Controller
        │
        ▼
Renderers
        │
        ▼
Content Actions
        │
        ▼
Browser
```

Each layer performs a single responsibility.

Information flows downward.

Lower layers should not directly depend upon higher layers.

---

# Published Project Source

The runtime intentionally remains independent of where projects originate.

Current development uses:

```text
assets/data/data.js
```

Future implementations may load the same project from:

- Local classroom server
- Local file
- Cloud storage
- District server
- Other project repositories

The remainder of the runtime should remain unchanged regardless of public project source.

---

# Project Loading

The Project Loader is responsible for obtaining a valid Project.

The Project Loader should know:

- Where projects originate
- How projects are deserialized
- How projects become Project objects

The remainder of the application should not know where project data came from.

---

# Validation

Validation exists between project loading and runtime execution.

Validation is divided into independent systems.

Examples include:

- Structural validation
- Asset validation

Validation should occur before rendering begins.

Whenever practical:

- Structural problems prevent startup.
- Asset problems generate warnings.

---

# Application Controller

The Application Controller coordinates runtime behavior.

Responsibilities include:

- Startup
- Navigation
- Viewer management
- Runtime state
- User messages
- Content launching

The controller should coordinate behavior rather than implement presentation.

---

# Rendering Architecture

Renderers transform project data into browser elements.

Renderers contain presentation logic only.

They do not:

- Validate
- Edit projects
- Store projects
- Launch content

Current rendering responsibilities include:

- Layout rendering
- Navigation rendering
- Section rendering
- Content rendering
- Tile rendering

Additional renderers may be added without affecting existing systems.

---

# Action Architecture

Content-specific behavior is isolated into independent action modules.

Examples include:

```text
video-action.js
pdf-action.js
website-action.js
image-action.js
powerpoint-action.js
```

Student Mode requests an action.

The content actions own:

- Opening
- Closing
- Cleanup
- Viewer lifecycle

This allows Student Mode and future Teacher previews to use the same implementation.

---

# Asset Architecture

Teacher-managed assets are intentionally separated from application resources.

```
resources/
    default-header.jpg
    default-tile.jpg

assets/
    data/
    images/
    videos/
    pdfs/
    powerpoints/
```

## Resources

Resources belong to the application.

Examples include:

- Default images
- Built-in graphics
- Static interface assets

Teachers do not manage resources.

Resources are never included in asset catalogs.

---

## Assets

Assets belong to classroom projects.

Examples include:

- Images
- Videos
- PDFs
- PowerPoint presentations

Teacher Mode manages these assets through catalogs and asset pickers.

Asset filenames are stored inside project data.

Asset paths are never stored.

---

# Runtime Pipeline

Student Mode performs the following sequence during startup.

```text
Published Project Source
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
Application Initialization
        │
        ▼
Container Rendering
        │
        ▼
User Interaction
```

Once initialization completes, Student Mode operates entirely in memory.

Navigation never reloads the browser.

Only the currently displayed Container is rendered.

---

# Navigation Architecture

Navigation is entirely Container based.

Student Mode never navigates directly to Layout Entries.

Navigation sequence:

```text
Current Container
        │
Navigation Entry Selected
        │
Referenced Child Container
        │
Render Child Container
```

The Home button always returns to the root Container.

The Back button always returns to the parent Container.

Browser page reloads should never occur during classroom navigation.

---

# Rendering Architecture

Rendering is intentionally modular.

Each renderer performs one responsibility.

Typical rendering responsibilities include:

- Layout Renderer
- Navigation Renderer
- Section Renderer
- Content Renderer
- Tile Renderer

Renderers should:

- Create browser elements
- Apply presentation rules
- Connect interaction callbacks

Renderers should not:

- Validate projects
- Modify project data
- Load assets directly
- Launch classroom content

---

# Tile Rendering

The Tile Renderer provides the reusable visual component used throughout Student Mode.

Every tile shares:

- Shape
- Layout
- Image handling
- Label styling
- Interaction behavior

Navigation tiles and content tiles should appear visually consistent.

Differences between tile types should come from icons, labels, and actions rather than entirely different visual components.

---

# Viewer Architecture

Large classroom resources open in dedicated viewers rather than replacing the current classroom page.

Current viewers include:

- Video Viewer
- PDF Viewer

Future viewers may include:

- Image Viewer
- Website Viewer
- PowerPoint Viewer

Each viewer should:

- Occupy most of the available screen
- Display the content title
- Provide a large Close button
- Return the student to the previous classroom page

Viewers should own their own cleanup logic.

Closing a viewer should completely release any active resources.

---

# Message Architecture

Student Mode provides temporary user messages.

Messages should:

- Be brief
- Be classroom friendly
- Automatically disappear
- Never expose implementation details

Messages should be coordinated by the Application Controller rather than individual renderers.

---

# Teacher Mode Architecture

Teacher Mode is a separate application built on the same Project structure.

Student Mode presents Projects.

Teacher Mode creates and modifies Projects.

Both modes operate on the same underlying classroom definition.

---

# Teacher Mode Goals

Teacher Mode is intended to allow non-technical teachers to build complete classroom experiences without editing source code.

Teacher Mode should eventually support:

- Creating pages
- Organizing page hierarchy
- Editing page properties
- Managing classroom assets
- Creating classroom activities
- Previewing classroom behavior
- Publishing projects

Teachers should never edit JavaScript or JSON directly.

---

# Teacher Workspace

The Teacher workspace is divided into three primary areas.

```text
Header

--------------------------------------------

Page Tree | Page Layout

--------------------------------------------

Editing Toolbar
```

The workspace separates:

- Classroom hierarchy
- Current page contents
- Editing commands

This organization allows teachers to focus on one task at a time.

---

# Container Tree

The Container Tree represents classroom hierarchy.

The tree should:

- Display page titles
- Display hierarchy
- Support expand and collapse
- Indicate inactive pages
- Clearly identify the selected page

The tree represents navigation only.

It does not represent layout order.

---

# Page Layout Editor

The Page Layout panel displays the ordered contents of the selected page.

Entries currently include:

- Sections
- Navigation
- Videos
- PDFs
- Images
- Websites
- PowerPoints
- Information
- Placeholders

Each row should display:

- Thumbnail
- Entry icon
- Entry name

The layout editor represents presentation order rather than navigation hierarchy.

---

# Asset Helpers

Asset Helpers resolve logical filenames into storage-specific paths.

Example:

alphabet.jpg

↓

assets/images/alphabet.jpg

This isolates storage knowledge into one location and allows storage implementations to change without affecting renderers or project data.

---

# Project Model

The Project Model is the editable representation of the classroom.

The Project Model exists only while a project is being edited and is reconstructed whenever a project is opened.

Every modification performed by Teacher Mode occurs through the Project Model.

Typical operations include:

- Create Container
- Rename Container
- Delete Container
- Move Container
- Enable Container
- Disable Container
- Add Layout Entry
- Delete Layout Entry
- Move Layout Entry
- Modify Properties

The Project Model maintains project integrity throughout editing.

---

# Validation During Editing

Teacher Mode performs validation continuously.

Validation should occur as edits are made rather than only during publishing.

Validation categories currently include:

## Structural Validation

Examples:

- Invalid hierarchy
- Circular references
- Missing Containers
- Invalid navigation
- Duplicate identifiers

Structural problems prevent publishing.

---

## Asset Validation

Examples:

- Missing images
- Missing PDFs
- Missing videos
- Missing PowerPoint files

Asset problems generate warnings whenever practical.

Publishing should remain possible unless a missing asset would produce an unusable classroom.

---

# Asset Catalog Architecture

Teacher-managed assets are discovered through generated catalogs.

Current catalogs include:

```text
assets/images/catalog.js
assets/pdfs/catalog.js
```

Future catalogs may include:

```text
assets/videos/catalog.js
assets/powerpoints/catalog.js
```

Catalogs provide:

- Filename discovery
- Search support
- Picker population

Catalogs intentionally expose filenames only.

They never expose storage paths.

---

# Asset Picker Architecture

Teacher Mode selects assets through picker dialogs.

Current pickers include:

- Image Picker
- PDF Picker

Future pickers may include:

- Video Picker
- PowerPoint Picker

Asset pickers:

- Load from catalogs
- Return filenames only
- Never return storage paths

The Project Model stores only filenames.

Asset helper functions determine where files are actually located.

---

# Project Storage

The application distinguishes between:

- Working Project
- Published Project

The Working Project is edited by Teacher Mode.

The Published Project is presented by Student Mode.

This separation allows editing without immediately affecting classroom presentation.

Current working storage uses browser Local Storage.

This implementation is expected to evolve without affecting Teacher Mode.

---

# Publishing Architecture

Publishing is intentionally isolated from editing.

Teacher Mode edits the Project Model.

Publishing distributes a serialized representation of that Project.

Teacher Mode should not know where published projects are stored.

Instead, publishing should operate through a publishing layer.

Future publishing destinations may include:

- Download
- Local classroom server
- Cloud service
- District server

The editing workflow should remain unchanged regardless of publishing destination.

---

# Published Project Format

The canonical published classroom project is:

```text
assets/data/data.js
```

This file represents the classroom presented by Student Mode.

The application should eventually treat this file as the published artifact regardless of how it was produced.

Current deployment may generate this file for manual distribution.

Future deployment may replace the same file automatically on a classroom server.

Student Mode should remain unaware of how the file arrived.

---

# Deployment Architecture

The VCC Classroom Launcher is designed so that deployment mechanisms can evolve without requiring changes to Student Mode or Teacher Mode.

The application should remain independent of:

- Hosting platform
- Storage mechanism
- Publishing destination

Deployment should be considered an implementation detail rather than an architectural dependency.

---

# Current Deployment

Current development uses the following workflow:

```text
Teacher Mode
        │
        ▼
Project Model
        │
        ▼
Publish
        │
        ├── Update Local Working Project
        │
        └── Generate assets/data/data.js
                     │
                     ▼
               Manual Distribution
                     │
                     ▼
                 GitHub Pages
```

This workflow allows classroom content to be edited without requiring cloud infrastructure.

The generated `assets/data/data.js` file represents the published classroom.

---

# Local Working Project

Teacher Mode maintains a local working copy of the classroom.

Current implementation uses browser Local Storage.

Local Storage exists only to support editing.

It should not be considered the permanent storage architecture.

Future implementations may replace Local Storage without affecting Teacher Mode.

---

# Published Project

The published classroom consists of the serialized Project.

Current published artifact:

```text
assets/data/data.js
```

Student Mode always presents the published Project.

The publishing mechanism determines how this file reaches the runtime.

Student Mode should remain unaware of:

- Local Storage
- GitHub
- Cloud services
- Classroom servers

---

# Publishing Pipeline

Publishing should always follow the same conceptual sequence.

```text
Project Model
        │
        ▼
Validation
        │
        ▼
Serialization
        │
        ▼
Published Project
        │
        ▼
Publishing Destination
```

The publishing destination may change over time.

The serialization process should not.

---

# Publishing Interface

Publishing should eventually become an independent architectural subsystem.

Teacher Mode should simply request publication.

Example:

```text
Teacher Mode
      │
Publish
      │
Publishing Interface
      │
Destination
```

The editor should not know:

- Where the project is stored
- How it is transferred
- Whether it is uploaded, downloaded, or copied

---

# Publishing Destinations

The architecture intentionally supports multiple publishing destinations.

Examples include:

## Manual Download

Teacher Mode generates:

```text
assets/data/data.js
```

The teacher distributes the file manually.

---

## Classroom Server

Teacher Mode sends the published Project to a classroom server.

The classroom server replaces:

```text
assets/data/data.js
```

Student Mode immediately begins presenting the new classroom.

---

## Cloud Publishing

Teacher Mode uploads the Project to a hosted service.

The service distributes the published classroom.

---

## District Repository

Future deployments may publish directly into district-managed classroom repositories.

The publishing interface should remain unchanged.

---

# Future Classroom Server

The preferred long-term deployment target is a dedicated classroom Mini-PC.

The Mini-PC should eventually host:

- Student website
- Teacher website
- Published classroom data
- Classroom assets
- Authentication
- Backups
- Future classroom services

The classroom server becomes the authoritative published environment.

Teacher Mode continues using the same editing workflow.

Only the publishing destination changes.

---

# Migration Path

The architecture intentionally supports gradual migration.

## Stage 1

Working Project

```text
Browser Local Storage
```

Published Project

```text
assets/data/data.js
```

Manual distribution.

---

## Stage 2

Working Project

```text
Browser Local Storage
```

Published Project

```text
assets/data/data.js
```

Automatically copied to the classroom server.

---

## Stage 3

Working Project

Classroom server.

Published Project

Classroom server.

Teacher Mode edits and publishes directly through the classroom network.

---

## Stage 4

Multiple authenticated teachers.

Shared classroom projects.

Version history.

Optional cloud synchronization.

The editing workflow should remain unchanged throughout every stage.

---

# Asset Evolution

Teacher-managed assets should follow the same migration path as project data.

Current organization:

```text
assets/
    data/
    images/
    videos/
    pdfs/
    powerpoints/
```

Future deployments should preserve this organization regardless of storage implementation.

Changing storage location should never require changing project data.

---

# Architectural Boundaries

Each major subsystem owns a single responsibility.

| System         | Responsibility                            |
| -------------- | ----------------------------------------- |
| Project Loader | Obtain published Project                  |
| Validators     | Verify Project integrity                  |
| Renderers      | Create interface                          |
| Actions        | Launch classroom content                  |
| Project Model  | Maintain editable Project                 |
| Teacher Mode   | Edit Projects                             |
| Publishing     | Produce and distribute published Projects |
| Asset Helpers  | Resolve storage locations                 |

No subsystem should assume responsibility belonging to another.

---

# Future Systems

The current architecture intentionally leaves room for future expansion.

Possible future systems include:

- User authentication
- Classroom templates
- Asset library
- Version history
- Undo / Redo
- Shared classroom repositories
- District deployment
- Cloud synchronization
- Automatic backups
- Classroom analytics

These systems should be implemented as new architectural layers rather than modifications to existing runtime systems.

---

# Architectural Rules

The following rules should guide future development.

## Project data stores logical information only.

Never store storage-specific paths inside project data.

---

## Resources belong to the application.

Assets belong to classroom projects.

Application resources should never appear inside teacher-managed asset catalogs.

---

## Editing and publishing remain independent.

Teacher Mode edits.

Publishing distributes.

Student Mode presents.

---

## Storage should remain replaceable.

Changing storage should not require changes to:

- Student Mode
- Teacher Mode
- Renderers
- Validators
- Actions

---

## Presentation and implementation remain separate.

Changing how something looks should not require changing project data.

Changing project data should not require changing presentation logic.

---

## New features should reuse existing systems.

New functionality should extend the architecture rather than duplicate it.

Whenever practical:

- Reuse dialogs
- Reuse renderers
- Reuse asset helpers
- Reuse pickers
- Reuse actions

before introducing new implementations.

---

# Summary

The VCC Classroom Launcher is organized around independent architectural systems that each perform a single responsibility.

The architecture intentionally separates:

- Editing
- Storage
- Rendering
- Validation
- Assets
- Publishing
- Presentation

This separation allows the application to evolve from a locally edited classroom launcher into a complete classroom authoring platform without requiring major architectural redesign.

The guiding architectural principle is:

> **Projects define classrooms. Student Mode presents Projects. Teacher Mode creates Projects. Publishing distributes Projects.**
