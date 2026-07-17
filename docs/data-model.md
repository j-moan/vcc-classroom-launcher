# VCC Classroom Launcher

# Data Model

## Overview

The VCC Classroom Launcher is entirely data driven.

The application is built around four primary concepts:

- Project
- Container Tree
- Container
- Layout

The Container Tree defines the navigation hierarchy.

Each Container represents one rendered classroom page.

Each Container owns an ordered Layout that defines how the page is displayed.

The rendering engine walks the Layout from beginning to end and renders each Layout Entry according to its type.

---

# Project

A Project represents a complete classroom.

A Project contains:

- Container Tree
- Shared Assets (future)
- Application Settings (future)

A project has exactly one root Container.

---

# Container Tree

The Container Tree defines the classroom navigation hierarchy.

Every Container, except the root Container, has exactly one parent Container.

Containers may have zero or more child Containers.

The Container Tree defines which classroom pages exist.

It does not define how those pages are rendered.

---

# Container

A Container represents one rendered classroom page.

Examples include:

- Home
- Reading
- Morning Meeting
- Math
- Science

Each Container contains:

- Metadata
- Child Containers
- Layout

A Container may be enabled or disabled.

Disabled Containers remain visible and editable in Teacher Mode.

Disabled Containers and their descendants are inaccessible in Student Mode.

---

# Container Metadata

Container metadata defines properties of the page itself.

Examples include:

- Name
- Header image
- Description
- Active
- Layout settings (future)

Additional page-level properties may be added in future versions.

---

# Layout

A Layout is an ordered list of Layout Entries.

The Layout determines exactly how a Container is rendered.

The rendering engine processes Layout Entries from beginning to end.

Layout order is independent of the Container Tree.

Teacher Mode allows Layout Entries to be reordered using drag and drop.

---

# Layout Entry Types

The following Layout Entry types are currently planned.

| Type        | Description                                       |
| ----------- | ------------------------------------------------- |
| Navigation  | Opens a child Container                           |
| Section     | Displays a full-width section heading             |
| YouTube     | Plays a YouTube video                             |
| Video       | Plays a local video                               |
| Website     | Opens a website                                   |
| PDF         | Opens a PDF document                              |
| PowerPoint  | Opens a PowerPoint presentation                   |
| Image       | Displays an image                                 |
| Information | Displays information without performing an action |

Additional Layout Entry types may be added in future versions.

---

# Navigation Entries

Navigation Entries represent child Containers.

Navigation Entries are created automatically from the Container Tree.

Teachers cannot manually create or delete Navigation Entries from the Layout.

Teachers may:

- Reorder Navigation Entries
- Enable or disable the associated Container
- Rename the associated Container through the Container Tree

Navigation Entries may appear anywhere within the Layout.

---

# Sections

Sections divide a page into visual groups.

Sections are rendered as full-width headings or separator lines.

The next Layout Entry begins at the far left below the Section.

Sections exist only within the Layout.

They do not participate in navigation.

---

# Content Entries

Content Entries perform actions or display information.

Current Content Entry types include:

- YouTube
- Video
- Website
- PDF
- PowerPoint
- Image
- Information

Every Content Entry belongs to exactly one Container through that Container's Layout.

---

# Rendering Model

Rendering follows a simple process.

1. Open the selected Container.
2. Load the Container's Layout.
3. Render each Layout Entry in order.

Navigation Entries open child Containers.

Content Entries perform their associated action.

Sections organize the visual presentation of the page.

---

# Teacher Model

Teacher Mode presents two coordinated views of the same Project.

## Container Tree

The left panel displays the Container Tree.

Teachers manage:

- Page hierarchy
- Page names
- Parent-child relationships
- Active state

## Layout

The right panel displays the selected Container's Layout.

Teachers manage:

- Content Entries
- Sections
- Ordering of all Layout Entries

Navigation Entries appear automatically based on the Container Tree.

---

# Application Defaults

Unless overridden, the application provides default behavior.

Examples include:

- Eight columns
- Cover image scaling
- Touch animation
- Default active state
- Default tile styling

Application defaults are defined globally rather than within individual Containers.

---

# Future Expansion

The data model is intentionally extensible.

Future versions may introduce:

- Additional Layout Entry types
- Shared Asset Library
- Page Templates
- Search
- Multiple Projects
- Theme support

The architecture is designed so these additions can be made without changing the fundamental Container Tree or Layout model.
