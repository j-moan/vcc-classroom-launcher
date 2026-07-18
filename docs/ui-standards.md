# VCC Classroom Launcher

# Student UI Standards

**Version:** 2.0 (Draft)

**Status:** Current

**Last Updated:** July 2026

---

# Purpose

This document defines the visual and interaction standards for Student Mode.

Its purpose is to ensure every classroom provides a consistent experience regardless of content.

Teacher Mode follows separate interface standards.

---

# Design Principles

Student Mode should be:

- Visual
- Predictable
- Touch-first
- Low distraction
- Consistent
- Accessible
- Fast

Students should be able to navigate naturally without instructions.

Every page should behave the same way.

---

# General Rules

Student Mode should never expose:

- Project structure
- Technical terminology
- Validation information
- File names
- Internal identifiers
- Teacher controls

Students interact only with classroom content.

---

# Page Structure

Every page consists of three primary regions.

```
Header
----------------------------

Content Area

----------------------------

Temporary Messages
```

The overall page structure remains consistent throughout the application.

---

# Header

The header contains:

- Background image
- Centered page title
- Home button
- Back button

The header should maximize available space for classroom content while remaining visually attractive.

---

## Header Height

The header should remain compact.

Current implementation targets approximately 40% less height than the original prototype.

---

## Page Title

The page title should:

- Be centered
- Be highly visible
- Remain readable from several feet away

Only one title should appear on the page.

---

# Navigation

Student Mode supports only two navigation controls.

## Home

Returns to the root Container.

---

## Back

Returns to the parent Container.

Back is hidden on the root Container.

---

## Navigation Position

Home and Back appear together in the upper-right corner.

They should remain easily reachable on a large touch display.

---

# Layout

The application displays one Layout at a time.

The Layout consists of an ordered collection of Layout Entries.

Entries are rendered from beginning to end.

---

## Default Columns

Application default:

```javascript
const DEFAULT_COLUMNS = 8;
```

Containers may override this value.

Responsive layouts reduce the column count automatically when required.

---

# Tiles

All Navigation Entries and Content Entries use the same tile component.

Every tile consists of:

- Image area
- Label

Descriptions are not displayed in Student Mode.

---

## Tile Appearance

Tiles should use:

- Rounded corners
- White background
- Light shadow
- Subtle border
- Consistent spacing

Visual styling should remain understated.

Content should receive the student's attention rather than decorative effects.

---

## Images

Images should use:

```css
object-fit: cover;
```

Images fill the available image area.

Cropping is preferred over distortion.

---

## Missing Images

If an image cannot be loaded:

- The tile remains visible.
- The layout remains unchanged.
- A "No image" placeholder is displayed.

Missing assets should never produce broken interface elements.

---

## Labels

Labels should be:

- Bold
- Centered
- Easy to read
- Large enough to read from across the room

Current implementation:

```css
font-size: 0.95rem;
font-weight: 700;
```

These values may be adjusted following classroom testing.

---

# Sections

Sections visually organize the Layout.

Sections:

- Span the page width.
- Display headings and optional descriptions.
- Separate groups of related content.

Sections never perform actions.

---

# Interaction

Student Mode supports both touch and mouse interaction.

Touch is the primary input method.

---

## Touch Feedback

Every selection should produce immediate visual feedback.

Students should never wonder whether a touch was recognized.

---

## Mouse Feedback

Desktop users may receive additional hover effects.

Hover effects should never be required for operation.

---

# Information Entries

Information Entries behave like normal tiles visually.

Selecting an Information Entry performs no navigation or content launch.

The current page remains displayed.

---

# Responsive Behavior

The interface should remain usable across multiple screen sizes.

Target behavior:

- Classroom display: up to 8 columns
- Desktop monitor: fewer columns when necessary
- Tablet: reduced column count
- Phone: one or two columns

Layouts should preserve readable labels and comfortable touch targets.

---

# Accessibility

Student Mode should support:

- Keyboard navigation
- Visible keyboard focus
- Meaningful aria-label values
- Sufficient color contrast
- Large touch targets

No important operation should depend solely on color.

Images should include meaningful alternative text whenever appropriate.

---

# Visual Consistency

Every classroom page should use the same:

- Header
- Navigation controls
- Tile appearance
- Label styling
- Section styling
- Touch feedback
- Spacing

Only classroom content should vary between pages.

---

# Error Presentation

Whenever practical, Student Mode should fail gracefully.

Examples include:

- Missing images display placeholders.
- Disabled Containers are simply absent.
- Missing assets never produce browser errors visible to students.

Validation details belong in Teacher Mode rather than Student Mode.

---

# Future Review

These standards should be reviewed after testing on Nicole's 65-inch classroom touchscreen.

Expected review topics include:

- Header height
- Label size
- Tile spacing
- Button sizing
- Responsive breakpoints
- Touch target size
- Placeholder appearance

---

# Design Principle

Student Mode exists to present classroom content—not software.

Every screen should feel calm, predictable, and immediately understandable to students.
