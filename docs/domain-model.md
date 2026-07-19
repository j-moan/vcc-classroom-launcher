# VCC Classroom Launcher

# Project Domain Model

## Purpose

This document defines the logical Project Domain Model used by the VCC Classroom Launcher.

The Domain Model describes the classroom itself rather than how the classroom is stored or rendered.

It defines:

- The objects that make up a classroom
- The relationships between those objects
- The rules that govern those relationships

This document intentionally remains independent of:

- JavaScript implementation
- Serialization format
- Storage mechanism
- User interface

The same logical model should remain valid whether the project is stored as:

- `assets/data/data.js`
- JSON
- A database
- A classroom server
- A cloud service

---

# Design Goals

The Domain Model is designed around several principles.

## Simple

The classroom should be understandable without knowledge of the application's implementation.

The logical model should describe classrooms rather than software.

---

## Stable

The logical model should remain stable even when implementation details change.

Changing serialization or storage should not require redesigning the classroom model.

---

## Portable

A classroom should exist independently of any computer or hosting environment.

Projects should be transferable between systems without changing their meaning.

---

## Extensible

New classroom capabilities should be introduced by extending the model rather than redesigning it.

New content types should not require changes to the existing hierarchy.

---

## Implementation Independent

The Domain Model intentionally avoids implementation details.

It describes:

- What the classroom contains
- How classroom objects relate

It does not describe:

- HTML
- JavaScript
- CSS
- Storage paths
- Rendering logic

---

# Core Concepts

The classroom is built around a small number of core concepts.

```
Project
    │
    ├── Containers
    │
    ├── Layouts
    │
    ├── Layout Entries
    │
    └── Assets
```

Every classroom can be completely described using these concepts.

---

# Project

A Project represents one complete classroom.

A Project owns every object required to present or edit a classroom.

A Project contains:

- Metadata
- Settings
- Containers
- Asset references

The Project is the root object of the Domain Model.

---

## Project Metadata

Metadata describes the classroom project itself.

Examples include:

- Classroom name
- Author
- Description
- Creation date
- Last modified date

Metadata does not affect classroom presentation.

---

## Project Settings

Project Settings define application-wide defaults.

Examples include:

- Default column count
- Default layout behavior
- Future theme settings

Individual Containers may override selected defaults.

---

# Container

A Container represents one classroom page.

Containers define navigation.

Containers own presentation.

Every Container owns exactly one Layout.

---

## Container Hierarchy

Containers form a strict tree.

```
Home
│
├── Reading
│    ├── Stories
│    └── Phonics
│
├── Math
│
└── Morning Meeting
```

Rules:

- Every Project has exactly one root Container.
- The root Container has no parent.
- Every other Container has exactly one parent.
- Containers may have zero or more children.
- Circular relationships are never permitted.

Hierarchy defines navigation.

Hierarchy does not define presentation.

---

## Container Properties

Typical Container properties include:

- Identifier
- Title
- Subtitle
- Parent
- Active state
- Layout
- Optional page settings

Future properties may be introduced without changing the overall model.

---

## Active State

Containers may be enabled or disabled.

Disabled Containers:

- Remain editable
- Remain part of the Project
- Are inaccessible within Student Mode

Disabling a Container also disables access to all descendants.

No classroom information is deleted when a Container is disabled.

---

# Layout

Every Container owns exactly one Layout.

A Layout defines the presentation order of visible objects.

Layouts do not define navigation.

Layouts do not define hierarchy.

Layouts are simply ordered collections.

Example:

```text
Navigation
Navigation
Section
Video
Website
Section
PDF
Information
```

Rendering follows Layout order.

---

## Layout Properties

Layouts may contain page-specific presentation settings.

Examples include:

- Column count
- Page spacing
- Future layout options

These settings affect presentation only.

---

# Layout Entries

Every visible object displayed within a Container is represented by one Layout Entry.

Layout Entries belong to exactly one Layout.

Layout Entries never own other Layout Entries.

Layout Entries do not participate in hierarchy.

---

## Layout Entry Types

Current Layout Entry categories include:

| Type        | Purpose                        |
| ----------- | ------------------------------ |
| Navigation  | Opens another Container        |
| Section     | Organizes presentation         |
| Video       | Launches a video               |
| PDF         | Opens a PDF                    |
| Website     | Opens a website                |
| Image       | Displays an image              |
| PowerPoint  | Opens a presentation           |
| Information | Displays informational content |
| Placeholder | Reserved classroom location    |

Additional Layout Entry types should extend the model without requiring structural redesign.

---

# Navigation Entries

Navigation Entries are unique.

Unlike other Layout Entries, Navigation Entries do not own the information they display.

Instead they reference another Container.

```
Parent Container
        │
        ▼
Navigation Entry
        │
        ▼
Child Container
```

The displayed title is derived from the referenced Container.

This prevents duplicated information within the Project.

---

## Navigation Rules

Navigation Entries follow these rules.

- Reference exactly one direct child Container.
- May only reference direct children.
- May appear anywhere within the Layout.
- Derive their displayed title from the referenced Container.
- May be reordered within the Layout.

Teacher Mode generates Navigation Entries automatically from the Container hierarchy.

Teachers manage the hierarchy rather than individual Navigation Entries.

---

# Sections

Sections organize presentation.

Sections are Layout Entries.

Sections may contain:

- Heading
- Description

Sections:

- Span the page width
- Separate groups of related content
- Never perform actions
- Never participate in navigation

Sections exist purely for presentation.

---

# Content Entries

Content Entries represent classroom activities or classroom resources.

Unlike Navigation Entries, Content Entries own their own presentation information.

Typical properties include:

- Label
- Image
- Target
- Active state
- Type-specific settings

Each Content Entry belongs to exactly one Layout.

---

# Assets

Assets represent reusable classroom media.

Examples include:

- Images
- Videos
- PDFs
- PowerPoint presentations

Assets are referenced by Layout Entries.

Assets never reference Layout Entries.

This allows a single Asset to be reused throughout the Project.

---

# Asset References

The Project intentionally stores only logical filenames.

Examples:

```text
alphabet.jpg

reading-centers.pdf

morning-video.mp4
```

The Project never stores storage paths such as:

```text
assets/images/alphabet.jpg

assets/pdfs/reading-centers.pdf
```

Resolving filenames into physical locations is the responsibility of the application's asset helper layer rather than the Domain Model.

---

# Project Model

Teacher Mode edits an in-memory Project Model.

The Project Model is the editable representation of the classroom.

Teacher Mode never edits serialized project data directly.

Every editing operation occurs through the Project Model.

Typical operations include:

- Create Container
- Delete Container
- Rename Container
- Enable Container
- Disable Container
- Add Layout Entry
- Delete Layout Entry
- Move Layout Entry
- Modify Properties

The Project Model is responsible for maintaining domain integrity throughout editing.

---

# Validation Rules

Projects are expected to satisfy several categories of validation.

---

## Structural Validation

Structural validation verifies the integrity of the Domain Model.

Examples include:

- Exactly one root Container
- Valid parent relationships
- Valid child relationships
- No circular hierarchy
- Supported Layout Entry types
- Valid navigation references

Structural validation failures prevent Student Mode from loading.

---

## Asset Validation

Asset validation verifies referenced classroom media.

Examples include:

- Missing images
- Missing PDFs
- Missing videos
- Missing PowerPoint presentations

Asset validation produces warnings whenever practical.

Missing assets should not invalidate an otherwise usable classroom.

---

# Serialization

Serialization exists only to persist Projects.

The serialized representation is not part of the Domain Model.

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

The serialization format may change without changing the logical classroom model.

---

# Guiding Principle

The Domain Model intentionally separates three independent concepts:

- Navigation
- Presentation
- Content

Containers define navigation.

Layouts define presentation.

Layout Entries define visible classroom objects.

Assets provide reusable classroom media.

The Project Model manages the classroom.

Student Mode presents the classroom.

Teacher Mode edits the classroom.
