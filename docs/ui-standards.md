# VCC Classroom Launcher

# UI Standards

## Purpose

This document defines the visual and interaction standards for the VCC Classroom Launcher.

It applies to:

- Student Mode
- Teacher Mode
- Shared interface components
- Dialogs and confirmation windows
- Asset pickers
- Content viewers
- Responsive behavior
- Accessibility

Student Mode and Teacher Mode serve different purposes and should not be treated as identical interfaces.

Student Mode prioritizes simplicity, visual communication, and classroom presentation.

Teacher Mode prioritizes clarity, organization, and efficient content management.

---

# Shared Design Principles

All VCC interfaces should be:

- Predictable
- Consistent
- Touch-friendly
- Accessible
- Responsive
- Visually calm
- Easy to understand without extensive instructions

The interface should avoid unnecessary decoration, technical terminology, and hidden behavior.

Common controls should look and behave consistently throughout the application.

---

# Visual Language

The application should use a restrained visual style.

Preferred characteristics include:

- Clear visual hierarchy
- Simple shapes
- Rounded corners
- Light borders
- Moderate shadows
- Generous spacing
- Strong text contrast
- Limited use of color
- Consistent control sizes

Color and decorative effects should support understanding rather than compete with classroom content.

---

# Component Naming

Reusable CSS classes should describe appearance or shared behavior rather than the feature that first used them.

Use generic names such as:

```text
app-dialog
dialog-form
dialog-title
dialog-input
dialog-actions
dialog-feedback
dialog-button
dialog-button-primary
dialog-button-secondary
```

Do not retain narrowly named reusable classes such as:

```text
password-dialog
password-form
password-input
password-actions
```

when those styles are also used for page creation, messages, confirmations, tile editing, and asset selection.

Element IDs may remain purpose-specific.

Examples:

```text
teacherPasswordDialog
addTileDialog
messageDialog
imagePickerDialog
pdfPickerDialog
```

CSS classes describe what a component is.

Element IDs describe what a specific instance does.

---

# Application Resources

Built-in visual resources belong to the application and are not teacher-managed assets.

Current default resources include:

```text
resources/default-header.jpg
resources/default-tile.jpg
```

Application resources should:

- Be referenced through shared helper functions where practical
- Never appear in teacher asset catalogs
- Never be stored as teacher-selected asset filenames
- Provide graceful fallbacks when classroom assets are missing

---

# Student Mode

## Purpose

Student Mode exists to present classroom content.

It should provide a visual, touch-first environment with minimal controls and no editing features.

Students should interact with classroom activities rather than with application configuration.

---

## Student Mode Principles

Student Mode should be:

- Visual
- Predictable
- Touch-first
- Low distraction
- Consistent
- Accessible
- Fast

Students should be able to navigate naturally without instructions.

Every classroom page should follow the same general interaction pattern.

---

## Student Mode Restrictions

Student Mode should never expose:

- Project structure
- File names
- Internal identifiers
- Validation details
- Storage paths
- Technical terminology
- Teacher editing tools
- Publishing controls
- Raw browser errors

Students should see classroom content, not implementation details.

---

# Student Page Structure

Each Student Mode page contains three primary regions:

```text
Header
--------------------------------

Classroom Content

--------------------------------

Temporary Messages or Content Viewers
```

The overall structure should remain consistent across all classroom pages.

---

# Student Header

The header contains:

- Background image
- Centered page title
- Teacher access button on the root page
- Home button on child pages
- Back button when a parent page exists

The header should remain compact enough to preserve space for classroom content while remaining visually distinct.

---

## Header Background

The standard header background uses:

```text
resources/default-header.jpg
```

The image should:

- Fill the header area
- Remain visually consistent between Student and Teacher modes
- Preserve title readability
- Avoid excessive detail behind text

A light overlay may be used to maintain sufficient contrast.

---

## Page Title

The page title should:

- Be centered
- Be highly visible
- Be readable from several feet away
- Use strong contrast
- Appear only once
- Reflect the currently displayed classroom page

Long titles should remain readable without breaking the overall header layout.

---

# Student Navigation

Student Mode uses a deliberately limited navigation model.

## Home

The Home control returns to the root classroom page.

It is hidden while the root page is already displayed.

---

## Back

The Back control returns to the current page's parent.

It is hidden:

- On the root page
- When the current page has no valid parent

---

## Teacher Access

The Teacher access control appears only on the root classroom page.

It should:

- Be visually distinct from student navigation
- Remain unobtrusive
- Require teacher authentication before opening Teacher Mode
- Never appear on child pages

The current password prompt is a deterrent for classroom use and should not be represented as strong security.

---

## Navigation Position

Home and Back should appear together in the upper-right portion of the header.

Teacher access should appear separately in the upper-left portion of the root header.

Controls should remain:

- Large enough for touch
- Clearly separated
- Consistent in position
- Easy to identify

---

# Student Layout

Student Mode displays one page layout at a time.

A layout is an ordered collection of:

- Navigation entries
- Content entries
- Section entries

Entries render in their stored order.

---

## Columns

The default classroom layout supports up to eight columns on a large display.

Pages may override the default column count when needed.

Responsive behavior should automatically reduce the number of columns on smaller screens.

Column reduction should preserve:

- Readable labels
- Useful image size
- Comfortable
