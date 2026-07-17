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
    │
Items
```

The application loads once.

Navigation between classroom pages occurs entirely in JavaScript without reloading the browser.

---

# Core Architecture

The VCC Classroom Launcher is built around two fundamental concepts:

## Containers

Containers organize the classroom hierarchy.

A container may contain zero or more Items.

Every container, except the root container, has exactly one parent container.

## Items

Every object displayed within the classroom is an Item.

Items are rendered according to their type.

Examples include:

- Container
- YouTube
- Local Video
- Website
- PDF
- PowerPoint
- Image
- Information
- Section (future)

The rendering engine determines how each Item behaves based solely on its type.

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

The application behaves as a hierarchical tree.

Every item has exactly one parent.

Navigation occurs by selecting container items.

The Home button always returns to the root container.

The Back button returns to the parent container.

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
