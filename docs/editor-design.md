# VCC Classroom Launcher

# Editor Design

**Version:** 2.0 (Draft)

**Status:** Current

**Last Updated:** July 2026

---

# Purpose

The VCC Classroom Editor is the visual authoring environment used to create and maintain classroom Projects.

Teacher Mode allows educators to build classroom experiences without requiring knowledge of programming, HTML, JSON, Git, or GitHub.

The editor is responsible for editing a Project Model.

The runtime is responsible for presenting that Project to students.

---

# Vision

The editor should feel familiar to anyone who has used:

- Windows Explorer
- Microsoft PowerPoint

The editor should never feel like:

- A website builder
- A programming environment
- A file management utility
- A development tool

Teachers should focus entirely on classroom organization and content.

---

# Design Goals

The editor should be:

- Visual
- Simple
- Fast
- Safe
- Drag-and-drop
- Easy to learn
- Difficult to break

Most classroom changes should require only a few mouse clicks.

---

# Project Model

Teacher Mode edits a Project through the Project Model.

The editor never edits serialized project data directly.

Typical operations include:

- Create Container
- Rename Container
- Move Container
- Enable Container
- Disable Container
- Add Layout Entry
- Remove Layout Entry
- Move Layout Entry
- Edit Properties
- Import Assets

The Project Model is responsible for maintaining project integrity.

---

# Main Window

```
+--------------------------------------------------------------------------------+
| File  Edit  View  Publish  Preview  Help                                       |
+------------------------------+-------------------------------------------------+
| Container Tree               | Layout                                          |
|                              |                                                 |
| ▼ Home                       | [Reading]                                       |
|   ▶ Morning Meeting          | [Video]                                         |
|   ▼ Reading                  | ------------------------------                  |
|      ▶ Books                 | Morning Activities                              |
|      ▶ Sight Words           | ------------------------------                  |
|   ▶ Math                     | [Website]                                       |
|                              | [PDF]                                           |
|                              | [Information]                                   |
+------------------------------+-------------------------------------------------+
| Properties                                                         Preview      |
+--------------------------------------------------------------------------------+
```

The editor presents two coordinated views of the same Project.

---

# Container Tree

The left panel displays the classroom navigation hierarchy.

Each node represents one Container.

Teachers manage:

- Container names
- Parent-child relationships
- Active state
- Navigation hierarchy

Supported operations include:

- Expand
- Collapse
- Rename
- Drag and Drop
- Right-click context menus

Disabled Containers remain visible so they may be re-enabled later.

Selecting a Container displays its Layout.

---

# Layout

The right panel displays the selected Container's Layout.

The Layout represents exactly what students will experience when viewing that Container.

The Layout may contain:

- Navigation Entries
- Content Entries
- Sections

Teachers edit the Layout using drag-and-drop.

Layout order determines rendering order.

---

# Navigation Entries

Navigation Entries are generated automatically from the Container hierarchy.

Teachers do not manually create or delete Navigation Entries.

Teachers may:

- Reorder Navigation Entries
- Position Navigation Entries anywhere within the Layout
- Rename the referenced Container
- Enable or disable the referenced Container

Navigation Entry labels are automatically obtained from the referenced Container.

Navigation Entries always reference direct child Containers.

---

# Content Entries

Teachers create Content Entries directly within the Layout.

Current Content Entry types include:

- Video
- Website
- PDF
- PowerPoint
- Image
- Information

Additional Content Entry types may be introduced without changing the editor architecture.

Content Entries may be positioned anywhere within the Layout.

---

# Sections

Sections divide the Layout into logical visual groups.

Sections are Layout Entries.

Sections:

- span the page width
- display headings or descriptions
- organize presentation
- do not participate in navigation

Sections may be reordered like any other Layout Entry.

---

# Properties Panel

Selecting an object displays the editable properties appropriate for that object.

Only relevant properties are shown.

## Container

Examples:

- Title
- Subtitle
- Active state

Future versions may include page-level settings.

---

## Navigation Entry

Navigation Entries derive most of their information from the referenced Container.

Teachers may edit:

- Position within the Layout

Teachers do not edit:

- Title
- Destination
- Parent

These properties belong to the referenced Container.

---

## Content Entry

Examples:

- Label
- Image
- Target
- Type-specific properties

---

## Section

Examples:

- Title
- Description

The editor never exposes internal identifiers or implementation details.

---

# Drag and Drop

The editor supports:

- Reordering Layout Entries
- Moving Content Entries between Containers
- Moving Sections
- Reordering Navigation Entries
- Reordering Containers
- Dragging images onto entries
- Dragging files into the Asset Library

Future versions may support:

- Ctrl+Drag duplication
- Multi-selection
- Clipboard operations

---

# Context Menu

Context menus present only operations appropriate for the selected object.

Examples include:

## Container

- Rename
- Enable / Disable
- Add Child Container
- Delete
- Move

---

## Content Entry

- Duplicate
- Delete
- Move

---

## Section

- Rename
- Delete
- Move

---

# Asset Library

The editor maintains a reusable Asset Library.

Examples include:

- Images
- Local videos
- Documents
- PowerPoint presentations

Assets may be reused by multiple Layout Entries.

Teachers should never need to locate the same file twice.

---

# Validation

Validation occurs continuously while editing.

The editor distinguishes between structural validation and asset validation.

---

## Structural Validation

Examples include:

- Invalid hierarchy
- Circular references
- Invalid parent relationships
- Duplicate identifiers
- Invalid Layout Entries

Structural validation failures prevent publishing.

---

## Asset Validation

Examples include:

- Missing image
- Missing document
- Missing presentation
- Missing media

Asset validation generates warnings.

Projects remain editable whenever practical.

---

# Preview Mode

The editor includes an integrated Student Preview.

Preview uses the same rendering pipeline as Student Mode.

This guarantees that teachers preview exactly what students will experience.

Teachers should be able to switch instantly between editing and previewing.

---

# Publishing

Publishing is a deliberate action.

Publishing may include:

- Structural validation
- Asset verification
- Project serialization
- Website generation
- Git commit
- GitHub Pages deployment

Publishing never modifies the live classroom until validation succeeds.

---

# Error Reporting

Validation messages should clearly explain:

- What is wrong
- Why it is wrong
- How to correct it

Teachers should never receive technical implementation errors.

---

# Future Features

Possible future enhancements include:

- Undo / Redo
- Search
- Favorites
- Recently Used Assets
- Automatic image resizing
- Automatic thumbnail generation
- Bulk rename
- Multi-select editing
- Copy / Paste
- Keyboard shortcuts
- Project templates
- Import Project
- Export Project
- Multiple classroom projects
- Multiple previews
- Theme support
- Cloud asset synchronization

---

# Design Principle

Teacher Mode should allow teachers to think in terms of classrooms rather than software.

Teachers organize Containers.

Teachers arrange Layouts.

Teachers configure Content.

The editor is responsible for translating those actions into a valid Project.

Teachers should never need to understand the underlying implementation.
