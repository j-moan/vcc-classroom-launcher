# VCC Classroom Launcher

# Vision

## Purpose

The VCC Classroom Launcher exists to make classroom technology simple, visual, and teacher-centered.

Its purpose is to allow teachers to create engaging classroom experiences without requiring programming knowledge while providing students with a consistent, touch-friendly interface that allows them to focus on learning instead of technology.

Teachers should think about teaching.

Students should think about learning.

The software should manage everything else.

---

# Product Vision

The VCC Classroom Launcher is intended to become a complete classroom authoring platform.

Teachers should be able to design, organize, publish, and maintain classroom content through a visual interface similar to familiar desktop applications.

The application should feel more like Microsoft PowerPoint than a web development environment.

Teachers should work with concepts such as:

- Pages
- Activities
- Lessons
- Images
- Videos
- Documents
- Classroom organization

They should never need to understand:

- HTML
- CSS
- JavaScript
- JSON
- Git
- File paths
- Web servers
- Programming

Those implementation details belong to the software.

---

# Primary Users

## Students

Student Mode exists to present classroom content.

Students should experience:

- Large visual navigation
- Simple, predictable layouts
- Consistent Home and Back navigation
- Fast response
- Touch-friendly interaction
- Minimal distractions

Student Mode should never expose editing or technical functionality.

---

## Teachers

Teacher Mode exists to author classroom experiences.

Teachers should be able to:

- Create classroom pages
- Organize navigation
- Manage classroom assets
- Build activities
- Preview classroom behavior
- Validate projects
- Publish classroom updates

The editor should encourage experimentation while protecting teachers from creating invalid classroom projects.

---

# Design Principles

## Teacher First

The software adapts to teachers.

Teachers should never need to adapt to the software.

---

## Student Simplicity

Students should interact with learning content—not application controls.

Every screen should be visually consistent and immediately understandable.

---

## Visual Communication

Images should communicate before text whenever practical.

Large touch targets and consistent layouts are more important than maximizing information density.

---

## Separation of Responsibilities

Each subsystem should have a single responsibility.

Examples include:

- Rendering
- Navigation
- Asset management
- Project storage
- Validation
- Publishing

Implementation details should remain hidden behind well-defined interfaces.

---

## Evolution Without Rewrite

Architectural decisions should support future growth without requiring major redesign.

Future enhancements should replace individual components rather than requiring the application to be rewritten.

---

# Architecture Vision

The project is designed as a collection of independent systems.

Each system should know only the information necessary to perform its responsibility.

Storage, rendering, editing, validation, and publishing should remain independent of one another.

This allows individual systems to evolve without affecting the rest of the application.

---

# Asset Architecture

Application resources are intentionally separated from teacher-managed assets.

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
- Static application assets

Teachers do not manage these files.

---

## Assets

Assets belong to classroom projects.

Examples include:

- Images
- Videos
- PDFs
- PowerPoint presentations

Teachers manage these assets through Teacher Mode.

---

# Project Data

Project data should remain independent of storage location.

Projects store only logical information.

Examples:

```json
{
  "image": "alphabet.jpg",
  "target": "reading-centers.pdf"
}
```

Projects never contain storage-specific paths.

Renderer helper functions resolve filenames into their physical locations.

Changing where assets are stored should never require changing project data.

---

# Publishing

Editing and publishing are separate responsibilities.

Teacher Mode edits a working project.

Publishing distributes that project.

Teacher Mode should never need to know where published projects are stored.

Instead, publishing should occur through a publishing interface that can evolve independently of the editor.

---

# Publishing Roadmap

## Initial Deployment

Teacher Mode maintains a working project using browser storage.

Publishing performs two actions:

- Updates the local working project.
- Generates a replacement `assets/data/data.js` file for distribution.

This allows classroom updates to be shared without requiring server infrastructure.

---

## Local Classroom Server

The long-term deployment target is a dedicated classroom Mini-PC.

The Mini-PC becomes the classroom server and hosts:

- Student website
- Teacher website
- Project data
- Classroom assets
- Authentication
- Backups
- Future classroom services

Publishing should eventually replace the generated `data.js` file directly on the server without changing the Teacher Mode workflow.

The teacher experience should remain unchanged regardless of where published data is stored.

---

## Future Expansion

The architecture should naturally support future capabilities including:

- Multiple teachers
- Authentication
- Shared classroom libraries
- Multiple classroom projects
- Asset libraries
- Import and Export
- Classroom templates
- Student analytics
- District deployment
- Cloud synchronization
- Collaborative editing

These features should extend the existing architecture rather than replace it.

---

# Long-Term Goal

The VCC Classroom Launcher is not simply a classroom website.

It is a classroom authoring platform.

Its purpose is to allow teachers to build engaging classroom experiences while hiding the underlying technology.

Students should experience learning—not software.

Teachers should experience teaching—not technology.
