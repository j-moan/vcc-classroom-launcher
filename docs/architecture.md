# VCC Classroom Launcher

# Architecture

## Overview

VCC Classroom Launcher is a browser-based classroom resource launcher designed primarily for large interactive touch displays.

The application is a client-side Single Page Application (SPA) hosted on GitHub Pages. No server-side processing is required during normal classroom use.

The classroom content is entirely data-driven and is generated from a structured data model rather than hard-coded HTML pages.

---

# Design Goals

The architecture is designed around the following principles:

- Fast
- Simple
- Reliable
- Touch friendly
- Data driven
- Easy to maintain
- Easy for non-technical teachers to manage

---

# High Level Architecture

```
Browser
    │
index.html
    │
app.js
    │
Data Model
    ├── Container Tree
    └── Container Layouts
```

The application loads once.

Navigation between classroom pages occurs entirely in JavaScript without reloading the browser.

---

# Core Architecture

The VCC Classroom Launcher is built around two fundamental concepts:

## Containers

A Container represents a rendered classroom page.

Containers form the navigation hierarchy. A Container may be the root page, a child of the root page, or a page nested several levels deep.

Every Container, except the root Container, has exactly one parent Container.

A Container may have:

- zero or more child Containers
- zero or more Items
- zero or more Sections

Each direct child Container is automatically represented on its parent page as a navigation tile.

Navigation tiles may be positioned anywhere within the parent page's ordered layout. Their names and existence are controlled through the Container tree rather than through the page-content editor.

A Container may be disabled. Disabled Containers remain visible and editable in Teacher Mode, but they and their descendants are not accessible in Student Mode.

## Items

Items are tiles displayed on a Container page.

Items may perform actions such as:

- Play a YouTube or local video
- Open a website
- Open a PDF
- Open a PowerPoint presentation
- Display an image
- Display information
- Perform no action

Items belong to exactly one Container and may be positioned anywhere within that Container's ordered page layout.

## Sections

Sections are page-layout elements rather than tiles.

A Section is rendered as a full-width line or heading. The next tile begins at the far left below the Section.

Sections may be positioned anywhere within the ordered page layout.

---

# Major Components

## index.html

Contains the permanent application layout.

Examples:

- Header
- Navigation buttons
- Content container

No classroom content is hard coded here.

---

## app.js

Application controller.

Responsible for:

- Loading data
- Rendering pages
- Rendering tiles
- Navigation
- Launching content
- Managing history
- Applying application defaults

---

## data.js

Contains the classroom content.

No application logic exists inside this file.

Teachers should eventually edit this information using the Content Editor rather than directly editing the file.

---

## styles.css

Defines the visual appearance of the application.

Examples:

- Colors
- Fonts
- Layout
- Tile appearance
- Touch animations
- Responsive behavior

---

# Navigation

Containers form a hierarchical navigation tree.

The root Container has no parent. Every other Container has exactly one parent Container.

Each enabled child Container is automatically displayed on its parent page as a navigation tile.

Selecting a navigation tile opens the associated child Container.

The position of each navigation tile is controlled by the parent Container's ordered page layout.

The Home button always returns to the root Container.

The Back button returns to the parent Container.

Disabled Containers remain visible in Teacher Mode but are hidden and inaccessible in Student Mode. Their descendants are also inaccessible.

---

# Deployment

Development

VS Code
↓

GitHub Desktop
↓

GitHub Repository
↓

GitHub Pages

Publishing updates the live classroom website.

---

# Future Architecture

Future versions will add:

- Visual Content Editor
- Asset Library
- Preview Mode
- Publish Validation
- Automatic asset management
- PowerPoint presentation support
- Search
- Multiple classroom projects
