# VCC Classroom Launcher

# Editor Design

## Vision

The VCC Classroom Editor is a visual classroom authoring tool designed specifically for teachers.

The editor should feel familiar to anyone who has used:

- Windows Explorer
- Microsoft PowerPoint

The editor should never feel like a website builder, programming tool, or file management application.

Teachers should never need to understand HTML, JavaScript, JSON, Git, or GitHub.

The editor presents two coordinated views of the classroom:

- The classroom navigation hierarchy
- The selected page's visual layout

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

# Main Window

```
+--------------------------------------------------------------------------------+
| File  Edit  View  Publish  Preview  Help                                       |
+------------------------------+-------------------------------------------------+
| Container Tree               | Layout                                          |
|                              |                                                 |
| ▼ Home                       | [Video]                                         |
|   ▶ Morning Meeting          | [PDF]                                           |
|   ▼ Reading                  | [Reading]                                       |
|      ▶ Books                 | ------------------------------                  |
|      ▶ Sight Words           | Morning Activities                              |
|   ▶ Math                     | ------------------------------                  |
|                              | [Information]                                   |
|                              | [Math]                                          |
|                              | [Video]                                         |
+------------------------------+-------------------------------------------------+
| Properties                                                         Preview      |
+--------------------------------------------------------------------------------+
```

---

# Container Tree

The left panel displays the classroom navigation hierarchy.

Each node in the tree represents a Container.

The tree defines:

- Page names
- Parent-child relationships
- Navigation hierarchy
- Active / Disabled state

The tree supports:

- Expand
- Collapse
- Rename
- Drag and Drop
- Right-click context menus

Disabled Containers remain visible so they can be re-enabled later.

The selected Container determines the Layout displayed in the right panel.

---

# Layout

The right panel displays the ordered Layout for the selected Container.

The Layout represents exactly what students will see when that page is displayed.

The Layout may contain:

- Navigation Entries
- Content Entries
- Sections

Teachers edit the Layout visually using drag and drop.

The Layout order determines the rendering order in Student Mode.

---

# Navigation Entries

Navigation Entries represent child Containers.

Navigation Entries are created automatically from the Container Tree.

Teachers cannot create or delete Navigation Entries directly.

Teachers may:

- Reorder Navigation Entries
- Move Navigation Entries anywhere within the Layout
- Rename the associated Container using the Container Tree
- Enable or disable the associated Container

When a Container is disabled, its Navigation Entry is hidden from Student Mode while remaining visible in Teacher Mode.

---

# Content Entries

Teachers create Content Entries directly within the Layout.

Supported Content Entry types include:

- YouTube
- Local Video
- Website
- PDF
- PowerPoint
- Image
- Information

Content Entries may be positioned anywhere within the Layout.

---

# Sections

Sections divide the Layout into logical visual groups.

Sections are rendered as full-width headings or separator lines.

The next Layout Entry begins at the far left below the Section.

Sections may be reordered like any other Layout Entry.

---

# Properties Panel

Selecting an object displays its editable properties.

Properties change based on the selected object type.

Examples:

Container

- Name
- Header image
- Description
- Active

YouTube

- Label
- Thumbnail
- YouTube URL

Website

- Label
- Thumbnail
- Website URL

PDF

- Label
- Thumbnail
- Document

PowerPoint

- Label
- Thumbnail
- Presentation

Information

- Label
- Thumbnail

Section

- Title
- Style (future)

The editor should never expose internal identifiers or implementation details.

---

# Drag and Drop

The editor supports:

- Reordering Layout Entries
- Moving Content Entries between Containers
- Moving Sections
- Reordering Navigation Entries
- Reordering Containers within the Container Tree
- Dragging images onto entries
- Dragging files into the Asset Library

Future versions may support Ctrl+Drag to duplicate Content Entries.

---

# Context Menu

Context menus should present only operations valid for the selected object.

Examples include:

Container

- Rename
- Enable / Disable
- Add Child Container
- Delete
- Move

Content Entry

- Duplicate
- Delete
- Move

Section

- Rename
- Delete
- Move

---

# Asset Library

The editor maintains a reusable Asset Library.

Examples include:

- Images
- Videos
- Documents
- PowerPoint Presentations

Assets may be reused by multiple Content Entries.

Teachers should never need to locate the same file twice.

---

# Preview Mode

The editor includes an integrated Student Preview.

Preview renders the currently selected Container exactly as students will experience it.

Teachers should be able to switch instantly between editing and previewing.

---

# Publishing

Publishing is a deliberate action.

Publishing should:

- Validate the project
- Detect missing assets
- Detect broken links
- Verify YouTube URLs
- Optimize images
- Generate the classroom website
- Commit changes to Git
- Publish to GitHub Pages

Publishing never modifies the live classroom until validation succeeds.

---

# Error Reporting

Validation messages should clearly explain:

- What is wrong
- Why it is wrong
- How to correct it

Teachers should never receive technical error messages.

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
- Multiple classroom projects
- Theme support
- Cloud asset synchronization
