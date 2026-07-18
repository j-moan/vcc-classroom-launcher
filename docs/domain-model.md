# VCC Classroom Launcher

# Project Domain Model

**Version:** 2.0 (Draft)

**Status:** Current

**Last Updated:** July 2026

---

# Purpose

This document defines the Project Data Model used by the VCC Classroom Launcher.

The Project Data Model describes every object that may exist within a classroom project and the relationships between those objects.

This document intentionally defines the logical model rather than the serialized storage format.

Future storage mechanisms (JSON, database, cloud services, etc.) should all represent this same Project Model.

---

# Scope

This document defines:

- Project structure
- Container hierarchy
- Layout organization
- Layout Entry types
- Project metadata
- Assets
- Application settings
- Validation rules
- Teacher Mode editing model

Implementation details and rendering behavior are documented separately in **Software Architecture.md**.

---

# Design Goals

The Project Model is designed around several principles.

## Simple

The data model should be understandable without knowledge of the implementation.

Teachers should ultimately edit projects through Teacher Mode rather than editing serialized files.

---

## Stable

The logical Project Model should remain stable even if the application's storage format changes.

Future migration from JavaScript objects to JSON, databases, or cloud services should not require redesigning the Project Model.

---

## Extensible

New content types and project features should be introduced without changing the existing hierarchy.

---

## Portable

Projects should eventually be transferable between computers.

A classroom project should exist independently of any specific computer or hosting environment.

---

# Glossary

## Project

A complete classroom definition.

A Project contains every object required to present or edit a classroom.

---

## Container

A Container represents one classroom page.

Containers define navigation.

Containers own Layouts.

---

## Layout

A Layout defines the ordered presentation of one Container.

Layouts do not define hierarchy.

---

## Layout Entry

A Layout Entry represents one visible object displayed within a Container.

---

## Asset

An Asset is reusable media referenced by one or more Layout Entries.

Examples include:

- images
- local videos
- PDF documents
- PowerPoint presentations

---

## Project Model

The editable in-memory representation of a Project.

Teacher Mode edits the Project Model.

Serialized project files are generated from the Project Model.

---

# High Level Project Structure

Conceptually every classroom project consists of the following objects.

```
Project
│
├── Metadata
├── Settings
├── Containers
├── Assets
└── Future Extensions
```

Student Mode renders Containers.

Teacher Mode edits the Project.

---

# Project

A Project represents one complete classroom.

Every classroom loaded by Student Mode or Teacher Mode is represented internally as exactly one Project.

A Project owns every object required to render the classroom.

Future versions may support multiple Projects.

---

## Project Metadata

Project Metadata describes the project itself rather than classroom pages.

Examples include:

- Project name
- Author
- Description
- Version
- Creation date
- Last modified date

Project Metadata does not affect classroom rendering.

---

## Project Settings

Project Settings define application-wide defaults.

Examples include:

- Default column count
- Default tile appearance
- Default image scaling
- Default animations
- Future theme settings

Individual Containers may override selected settings.

---

# Containers

Containers represent classroom pages.

Containers define navigation.

Containers form a strict hierarchical tree.

Each Container owns one Layout.

---

## Container Hierarchy

Containers form the navigation structure.

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

Rules:

- Every Project has one root Container.
- The root Container has no parent.
- Every other Container has exactly one parent.
- Containers may have zero or more children.
- Circular relationships are not permitted.

---

## Container Properties

Each Container contains information describing one classroom page.

Typical properties include:

- Title
- Subtitle
- Parent
- Active state
- Child Container list
- Layout
- Optional page settings

Additional properties may be introduced without changing the overall architecture.

---

## Active State

Containers may be enabled or disabled.

Disabled Containers remain editable within Teacher Mode.

Disabled Containers are inaccessible within Student Mode.

The disabled state applies recursively to descendant Containers.

---

# Layout

Each Container owns exactly one Layout.

The Layout determines how the page is presented.

The Layout does not define navigation.

The Layout is simply an ordered collection.

Example:

```
Navigation
Navigation
Section
Video
Website
Section
Image
PDF
Information
```

Rendering always follows Layout order.

---

## Layout Properties

Layouts may eventually support page-specific settings.

Examples include:

- Column count
- Tile spacing
- Page padding
- Future layout options

These properties affect presentation only.

---

# Layout Entries

A Layout consists of an ordered collection of Layout Entries.

Every visible object displayed within Student Mode is represented by one Layout Entry.

Layout Entries do not own other Layout Entries.

Layout Entries never participate in navigation hierarchy.

---

## Supported Layout Entry Types

Current Layout Entry types include:

| Type        | Purpose                        |
| ----------- | ------------------------------ |
| Navigation  | Opens a child Container        |
| Section     | Organizes page presentation    |
| Video       | Plays a video                  |
| Website     | Opens a website                |
| PDF         | Opens a document               |
| PowerPoint  | Opens a presentation           |
| Image       | Displays an image              |
| Information | Displays informational content |

Additional Layout Entry types may be added in future versions without changing the Project Model.

---

# Navigation Entries

Navigation Entries provide access to child Containers.

Navigation Entries are unique because they do not own the information they display.

Instead, they reference an existing child Container.

```
Parent Container
        │
        ▼
 Navigation Entry
        │
        ▼
 Child Container
```

The displayed title is obtained from the referenced Container.

This eliminates duplicated information within the Project.

---

## Navigation Entry Rules

Navigation Entries follow the following rules.

- Every Navigation Entry references exactly one direct child Container.
- Navigation Entries may only reference direct children.
- Navigation Entries may appear anywhere within the Layout.
- Navigation labels are automatically derived from the referenced Container.
- Teachers may reorder Navigation Entries.
- Teachers may not manually create or delete Navigation Entries.
- Disabling a Container automatically removes it from Student Mode navigation.

Teacher Mode generates Navigation Entries automatically from the Container hierarchy.

---

# Sections

Sections organize the visual presentation of a page.

Sections are Layout Entries.

Sections do not participate in navigation.

Sections may contain:

- Heading
- Description

Sections span the width of the page.

The next Layout Entry begins at the first column below the Section.

Multiple Sections may exist within the same Layout.

---

# Content Entries

Content Entries represent classroom resources.

Unlike Navigation Entries, Content Entries own their own presentation information.

Typical properties include:

- Label
- Image
- Target
- Type-specific properties

Each Content Entry belongs to exactly one Layout.

---

## Content Types

The initial implementation supports:

- Video
- Website
- PDF
- PowerPoint
- Image
- Information

Future versions may introduce additional content types without changing the Project Model.

---

# Assets

Assets represent reusable classroom media.

Examples include:

- Images
- Local videos
- PDF documents
- Presentations

Layout Entries reference Assets.

Assets do not reference Layout Entries.

This allows the same Asset to be reused throughout a Project.

Future Teacher Mode versions will manage Assets through an Asset Library.

---

# Project Model

Teacher Mode edits a Project through the Project Model.

The Project Model is the editable in-memory representation of a classroom.

The Project Model is responsible for maintaining project integrity.

Teacher Mode never edits serialized project data directly.

---

## Project Operations

Typical Project Model operations include:

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
- Remove Assets

Future operations may include:

- Duplicate Container
- Copy Layout
- Undo
- Redo
- Bulk editing

---

# Validation Rules

Projects are expected to satisfy several categories of validation.

---

## Structural Validation

Structural validation verifies Project integrity.

Examples include:

- One root Container
- Valid parent relationships
- Valid child relationships
- No circular hierarchy
- Supported Layout Entry types
- Navigation integrity

Structural validation failures prevent Student Mode from loading.

---

## Asset Validation

Asset validation verifies referenced media.

Examples include:

- Missing images
- Missing videos
- Missing documents
- Missing presentations

Asset validation generates warnings.

Missing assets should not prevent classroom operation whenever practical.

---

# Serialization

The Project Model is independent of storage.

Teacher Mode edits the Project Model.

Saving a Project serializes the Project Model into a portable format.

```
Project Model
       │
       ▼
Serialized Project
```

Loading performs the reverse operation.

```
Serialized Project
       │
       ▼
Project Model
```

The serialization format may evolve without changing the logical Project Model.

---

# Teacher Editing Model

Teacher Mode presents two coordinated views of the same Project.

---

## Container Tree

The left panel displays the Container hierarchy.

Teachers manage:

- Container names
- Parent-child relationships
- Active state
- Container selection

The Container Tree defines navigation.

---

## Layout Editor

The right panel displays the selected Container's Layout.

Teachers manage:

- Sections
- Content Entries
- Ordering of Layout Entries

Navigation Entries appear automatically based on the Container hierarchy.

The Layout Editor defines presentation.

---

## Properties Panel

Selecting an object displays its editable properties.

Examples include:

### Container

- Title
- Subtitle
- Active state

### Section

- Heading
- Description

### Content Entry

- Label
- Image
- Target
- Type-specific properties

Only properties appropriate for the selected object are displayed.

---

# Application Defaults

Projects inherit global application defaults.

Examples include:

- Default column count
- Default tile appearance
- Default image scaling
- Default animations

Containers may override selected defaults when appropriate.

---

# Future Expansion

The Project Model is intentionally extensible.

Future versions may introduce:

- Additional Layout Entry types
- Shared Asset Library
- Page Templates
- Themes
- Multiple Projects
- Search
- Localization
- Cloud synchronization

These enhancements should extend the existing Project Model rather than replacing it.

---

# Summary

The Project Data Model separates three independent concepts:

- Navigation
- Presentation
- Content

Containers define navigation.

Layouts define presentation.

Layout Entries define the visible objects displayed within a page.

Teacher Mode edits the Project Model.

Student Mode presents the Project Model.

Serialization exists only to persist Projects between editing sessions.

The guiding principle of the Project Data Model is:

> **A Project describes a classroom. The Project Model manages the classroom. Student Mode presents the classroom.**
