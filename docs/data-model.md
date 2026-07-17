# VCC Classroom Launcher

# Data Model

## Overview

The VCC Classroom Launcher is entirely data driven.

Every object in the classroom is represented by a single Item.

Items are organized into a hierarchy using parent-child relationships.

Every item has exactly one parent.

The Home item is the root of the hierarchy.

---

# Item Types

The system currently supports the following item types.

| Type        | Description                                 |
| ----------- | ------------------------------------------- |
| container   | Contains other items                        |
| youtube     | Plays a YouTube video                       |
| video       | Plays a local video                         |
| website     | Opens a website                             |
| pdf         | Opens a PDF document                        |
| powerpoint  | Opens a PowerPoint presentation             |
| image       | Displays an image                           |
| information | Displays information but performs no action |

Additional item types may be added in future versions.

---

# Common Properties

Every item contains the following properties.

| Property | Required | Description                 |
| -------- | -------- | --------------------------- |
| id       | Yes      | Unique identifier           |
| parent   | Yes      | Parent item identifier      |
| label    | Yes      | Text shown beneath the tile |
| image    | Yes      | Tile image                  |
| type     | Yes      | Item type                   |
| active   | No       | Defaults to true            |

---

# Container Item

```javascript
{
    id: "reading",
    parent: "home",
    label: "Reading",
    image: "images/reading.jpg",
    type: "container"
}
```

---

# YouTube Item

```javascript
{
    id: "hello-song",
    parent: "morning-meeting",
    label: "Hello Song",
    image: "images/hello-song.jpg",
    type: "youtube",
    videoId: "abc123"
}
```

---

# Local Video Item

```javascript
{
    id: "counting-song",
    parent: "math",
    label: "Counting Song",
    image: "images/counting.jpg",
    type: "video",
    file: "videos/counting.mp4"
}
```

---

# Website Item

```javascript
{
    id: "starfall",
    parent: "reading",
    label: "Starfall",
    image: "images/starfall.jpg",
    type: "website",
    url: "https://www.starfall.com"
}
```

---

# PDF Item

```javascript
{
    id: "rules",
    parent: "classroom",
    label: "Class Rules",
    image: "images/rules.jpg",
    type: "pdf",
    file: "documents/rules.pdf"
}
```

---

# PowerPoint Item

```javascript
{
    id: "community-helpers",
    parent: "social-studies",
    label: "Community Helpers",
    image: "images/community-helpers.jpg",
    type: "powerpoint",
    file: "presentations/community-helpers.pptx"
}
```

---

# Image Item

```javascript
{
    id: "butterfly",
    parent: "science",
    label: "Butterfly",
    image: "images/butterfly.jpg",
    type: "image",
    file: "images/butterfly-large.jpg"
}
```

---

# Information Item

```javascript
{
    id: "todays-schedule",
    parent: "home",
    label: "Today's Schedule",
    image: "images/schedule.jpg",
    type: "information"
}
```

Information items provide visual information only.

Selecting an information item provides touch feedback but performs no navigation or launch action.

---

# Parent Relationships

Every item belongs to exactly one parent.

The resulting structure forms a tree.

```
Home
├── Morning Meeting
│   ├── Hello Song
│   └── Calendar
├── Reading
│   ├── Brown Bear
│   └── Pete the Cat
└── Math
```

---

# Application Defaults

Unless overridden, the application provides default behavior.

Examples include:

- Eight columns
- Cover image scaling
- Touch animation
- Active = true

Application defaults are defined in the application configuration rather than in individual items.

---

# Future Expansion

The data model is intentionally extensible.

Future versions may introduce additional item types without changing the overall architecture.
