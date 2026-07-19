"use strict";

import { createTile } from "./tile-renderer.js";
import { getImagePath, getDefaultTileImagePath } from "../utilities/asset-paths.js";

export function renderContentEntry(entry, context) {
  const { onAction } = context;

  const label = entry.label || "Untitled";

  return createTile({
    label,
    image: entry.image ? getImagePath(entry.image) : getDefaultTileImagePath(),
    onSelect: () => onAction(entry),
  });
}
