# VCC Classroom Launcher

# UI Standards

## Purpose

This document defines the visual and interaction standards for the VCC Classroom Launcher.

The goal is to keep the student experience simple, consistent, touch-friendly, and easy to understand across all classroom pages.

---

# Student Interface Principles

The student-facing interface should be:

- Visual
- Predictable
- Touch-friendly
- Low-clutter
- Consistent across pages
- Easy to use without reading instructions

The interface should avoid unnecessary menus, controls, text, and distractions.

---

# Header

The header contains:

- A full-width background image
- A centered page title
- Home and Back controls in the upper-right corner

The header should be compact enough to preserve screen space for classroom content.

Current standard:

- Large centered title
- Approximately 40% shorter than the original prototype header
- Background image fills the header
- Home and Back buttons appear as white circular controls

---

# Navigation Controls

## Home

The Home button always returns to the root classroom page.

## Back

The Back button returns to the parent container.

The Back button should be hidden when the user is already on the Home page.

## Position

Navigation controls appear together in the upper-right corner of the header.

They should remain easy to reach on a large touchscreen.

---

# Tile Layout

The default layout is:

- Eight tiles across on large classroom displays
- Tiles arranged left to right, then top to bottom
- Consistent spacing between tiles
- Responsive reduction in column count on smaller screens

Application default:

```javascript
const DEFAULT_COLUMNS = 8;
```

A page or section may override the default when necessary.

---

# Tile Structure

Every tile contains:

1. Image
2. Label

No description is shown beneath the label in the student interface.

The tile image should use:

```css
object-fit: cover;
```

This allows the image to fill the tile frame.

---

# Tile Appearance

Tiles should use:

- Rounded corners
- Subtle borders
- Light shadows
- White background
- Centered labels
- Minimal decorative elements

Current image-frame corner radius:

```css
border-radius: 14px;
```

---

# Tile Labels

Tile labels should be:

- Centered
- Bold
- Easy to read from several feet away
- Small enough to support eight tiles across

Current starting point:

```css
font-size: 0.95rem;
font-weight: 700;
```

Final values may be adjusted after testing on the 65-inch classroom touchscreen.

---

# Touch and Mouse Feedback

Every tile should provide immediate visual feedback when selected.

## Touch

The active state should briefly confirm that the touch was registered.

## Mouse

Hover may lift the tile slightly and increase the shadow.

Example:

```css
.classroom-tile:hover .tile-image-frame {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(60, 64, 67, 0.28);
}
```

Hover behavior is optional on touchscreens but useful on desktop computers.

---

# Information Tiles

Information tiles look and respond like other tiles.

When selected:

- The normal touch animation occurs
- No navigation or content launch occurs
- The user remains on the current page

---

# Responsive Behavior

The interface should adapt to smaller displays.

The target behavior is:

- Large classroom display: up to 8 columns
- Laptop or smaller display: fewer columns
- Tablet: fewer columns
- Phone: one or two columns

The responsive layout must preserve readable labels and usable touch targets.

---

# Accessibility

The interface should include:

- Clear keyboard focus indicators
- Meaningful `aria-label` values
- Adequate color contrast
- Large touch targets
- Predictable navigation
- No critical action dependent only on color

Images should include meaningful alternative text when appropriate.

---

# Visual Consistency

All classroom pages should use the same:

- Header structure
- Navigation controls
- Tile shape
- Label style
- Touch feedback
- Spacing rules

Page-specific customization should be limited and intentional.

---

# Future Review

These standards should be reviewed after Nicole tests the application on the actual 65-inch touchscreen.

Expected areas for adjustment:

- Label size
- Tile spacing
- Header height
- Button size
- Responsive column thresholds
