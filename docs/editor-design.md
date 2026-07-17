# VCC Classroom Launcher

# Editor Design

## Vision

The VCC Classroom Editor is a visual content management application designed specifically for teachers.

The editor should feel familiar to anyone who has used:

- Windows Explorer
- Microsoft PowerPoint

The editor should never feel like a website builder or programming tool.

Teachers should not need to understand HTML, JavaScript, JSON, Git, or file management.

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
+-----------------------------------------------------------------------+
| File  Edit  View  Publish  Preview  Help                              |
+-------------------------+---------------------------------------------+
| ▼ Home                  |  Reading                                    |
|   ▶ Morning Meeting     |                                             |
|   ▼ Reading             |  [🐻] Brown Bear                            |
|      ▶ Books            |  [🐱] Pete the Cat                          |
|      ▶ Sight Words      |  [📚] Dr. Seuss                             |
|   ▶ Math                |                                             |
|                         |  [+ Add Item]                               |
+-------------------------+---------------------------------------------+
| Properties                                                    Preview |
+-----------------------------------------------------------------------+
```

---

# Left Panel

The left panel displays the classroom hierarchy.

Only **Container** items appear in the tree.

The tree should support:

- Expand
- Collapse
- Rename
- Drag and Drop
- Right-click context menus

Expanded state should be remembered between editing sessions.

---

# Right Panel

The right panel displays the contents of the selected container.

Items should appear as visual tiles similar to the student interface.

The teacher edits what the students will actually see.

---

# Properties Panel

Selecting an item displays its properties.

Properties change based upon the selected item type.

Examples:

Container

- Label
- Image

YouTube

- Label
- Image
- YouTube URL

Website

- Label
- Image
- Website URL

PowerPoint

- Label
- Image
- Presentation File

Information

- Label
- Image

The editor should never expose internal IDs or file paths.

---

# Add Item

Adding a new item should begin by selecting its type.

Supported types:

- Container
- YouTube
- Local Video
- Website
- PDF
- PowerPoint
- Image
- Information

The editor then requests only the information required for that item type.

---

# Drag and Drop

The editor should support:

- Reordering items
- Moving items between containers
- Dragging images onto tiles
- Dragging files into the asset library

Future versions may support Ctrl+Drag to duplicate items.

---

# Context Menu

Right-clicking an item should display commands such as:

- Open
- Rename
- Duplicate
- Delete
- Activate
- Deactivate
- Move

---

# Asset Library

The editor maintains a reusable library of assets.

Examples:

Images

Videos

Documents

PowerPoint Presentations

Assets can be reused by multiple classroom items.

The teacher should never need to locate the same file twice.

---

# Preview Mode

The editor includes a Student Preview mode.

Preview displays the classroom exactly as students will experience it.

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

Publishing should never modify the live classroom until validation succeeds.

---

# Error Reporting

Validation errors should clearly explain:

- What is wrong
- Why it is wrong
- How to fix it

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
- Cloud asset synchronization
