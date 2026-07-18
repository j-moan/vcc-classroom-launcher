"use strict";

import { createTile } from "./tile-renderer.js";

export function renderContentEntry(entry, context) {
  const { onAction } = context;

  const label = entry.label || entry.title || "Untitled";

  return createTile({
    label,
    image: entry.image,
    onSelect: () => onAction(entry),
  });
}
