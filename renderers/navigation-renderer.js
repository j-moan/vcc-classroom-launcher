"use strict";

import { getImagePath, getDefaultTileImagePath } from "../utilities/asset-paths.js";
import { createTile } from "./tile-renderer.js";

export function renderNavigationEntry(entry, context) {
  const { containerId, getContainer, isContainerAccessible, onNavigate } = context;

  if (!entry.container) {
    console.warn("A navigation entry is missing its Container reference.");
    return null;
  }

  const childContainer = getContainer(entry.container);

  if (!childContainer) {
    console.warn(`Navigation entry references missing Container: ${entry.container}`);
    return null;
  }

  if (childContainer.parent !== containerId) {
    console.warn(`Container "${entry.container}" is not a direct child of "${containerId}".`);
    return null;
  }

  if (!isContainerAccessible(entry.container)) {
    return null;
  }

  return createTile({
    label: childContainer.title || "Untitled",
    image: entry.image ? getImagePath(entry.image) : getDefaultTileImagePath(),
    onSelect: () => onNavigate(entry.container),
  });
}
