"use strict";

import { renderNavigationEntry } from "./navigation-renderer.js";
import { renderSectionEntry } from "./section-renderer.js";
import { renderContentEntry } from "./content-renderer.js";

const CONTENT_ENTRY_TYPES = new Set([
  "video",
  "website",
  "pdf",
  "powerpoint",
  "image",
  "information",
]);

export function renderLayout(context) {
  const { container, defaultColumns } = context;

  const grid = document.createElement("div");
  grid.className = "tile-grid";

  grid.style.setProperty("--page-columns", container.columns || defaultColumns);

  const layout = Array.isArray(container.layout) ? container.layout : [];

  layout.forEach((entry) => {
    const renderedEntry = renderLayoutEntry(entry, context);

    if (renderedEntry) {
      grid.appendChild(renderedEntry);
    }
  });

  return grid;
}

function renderLayoutEntry(entry, context) {
  if (!entry?.type) {
    console.warn("A layout entry is missing its type.", entry);
    return null;
  }

  if (entry.type === "navigation") {
    return renderNavigationEntry(entry, context);
  }

  if (entry.type === "section") {
    return renderSectionEntry(entry);
  }

  if (CONTENT_ENTRY_TYPES.has(entry.type)) {
    return renderContentEntry(entry, context);
  }

  console.warn(`Unsupported layout entry type: ${entry.type}`);
  return null;
}
