# VCC Classroom Launcher

# Editor Design

## Purpose

This document defines the design of Teacher Mode.

Teacher Mode is the classroom authoring environment used to create and maintain classroom Projects.

Unlike the Architecture document, which defines software organization, this document defines how teachers interact with the editor.

Its purpose is to ensure that Teacher Mode remains simple, predictable, and focused on classroom authoring rather than software development.

---

# Design Philosophy

Teacher Mode should allow teachers to think about classrooms rather than technology.

Teachers should organize:

- Pages
- Activities
- Resources
- Classroom structure

Teachers should never need to understand:

- HTML
- JavaScript
- JSON
- Git
- File paths
- Project serialization

The editor translates classroom operations into a valid Project Model.

---

# Primary Goals

Teacher Mode should be:

- Visual
- Touch friendly
- Easy to learn
- Difficult to misuse
- Fast for common tasks
- Consistent throughout the application

Most classroom changes should require only a few interactions.

---

# Editing Model

Teacher Mode edits an in-memory Project Model.

Every editing operation modifies the Project Model.

Publishing creates a serialized representation of that Project.

Teacher Mode never edits serialized project files directly.

---

# Workspace

The editor consists of three primary work areas.

```text
Header

--------------------------------------------

Container Tree | Page Layout

--------------------------------------------

Editing Toolbar
```

Each area has a single responsibility.

---

# Container Tree

The Container Tree represents classroom navigation.

Teachers use the tree to:

- Create pages
- Rename pages
- Delete pages
- Move pages
- Enable or disable pages
- Select the page being edited

The tree represents hierarchy only.

It does not represent presentation.

---

# Page Layout

The Page Layout represents the contents of the selected page.

Teachers arrange:

- Navigation entries
- Sections
- Activities
- Classroom resources

The order of Layout Entries determines presentation order.

The Layout never changes classroom hierarchy.

---

# Properties

Selecting an object displays its editable properties.

Only properties appropriate for the selected object should be displayed.

Examples include:

Container

- Title
- Subtitle
- Active state

Section

- Heading
- Description

Content Entry

- Label
- Image
- Target
- Type-specific settings

The editor should never expose internal identifiers or implementation details.

---

# Asset Selection

Teacher Mode manages classroom media through asset pickers.

Examples include:

- Image Picker
- PDF Picker
- Video Picker
- PowerPoint Picker

Asset pickers should:

- Display available assets
- Allow searching
- Return filenames only

Teachers should never manage storage paths.

---

# Drag and Drop

Whenever practical, Teacher Mode should support direct manipulation.

Examples include:

- Reordering Layout Entries
- Moving pages
- Rearranging navigation
- Importing classroom assets

Dragging should always produce predictable results.

---

# Validation

Validation occurs continuously while editing.

Teacher Mode should distinguish between:

- Structural errors
- Asset warnings

Teachers should receive clear explanations of problems.

Validation messages should explain:

- What is wrong
- Why it is wrong
- How to correct it

Implementation details should never appear in validation messages.

---

# Preview

Teacher Mode should provide an integrated Student Preview.

Preview should use the same rendering pipeline as Student Mode.

Teachers should preview the classroom exactly as students will experience it.

Preview should never use a separate implementation.

---

# Publishing

Publishing is a deliberate teacher action.

Publishing should:

- Validate the Project
- Serialize the Project
- Produce the published classroom
- Deliver it to the configured publishing destination

Teacher Mode should remain unaware of where the published Project is ultimately stored.

---

# Error Handling

Whenever practical:

- Prevent invalid edits.
- Explain problems clearly.
- Preserve teacher work.
- Recover gracefully.

Teacher Mode should never expose technical errors to teachers.

---

# Future Capabilities

The editor has been designed to accommodate future enhancements, including:

- Undo / Redo
- Multi-selection
- Keyboard shortcuts
- Project templates
- Shared asset libraries
- Multiple classroom projects
- Automatic backups
- Cloud synchronization

These capabilities should extend the existing editing model rather than replace it.

---

# Guiding Principles

Every editor feature should reinforce the following goals.

- Teachers organize classrooms.
- Teachers never edit implementation details.
- The editor edits the Project Model.
- Validation protects project integrity.
- Preview reflects Student Mode.
- Publishing produces the classroom presented to students.

The editor should always make classroom authoring simpler without exposing the underlying implementation.
