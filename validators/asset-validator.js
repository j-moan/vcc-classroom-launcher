"use strict";

import { getImagePath } from "../utilities/asset-paths.js";

const ASSET_TIMEOUT_MS = 5000;

export async function validateAssets(project) {
  const references = collectImageReferences(project);
  const uniquePaths = [...new Set(references.map((reference) => reference.path))];

  const statusByPath = new Map();

  await Promise.all(
    uniquePaths.map(async (path) => {
      statusByPath.set(path, await checkImage(path));
    }),
  );

  const warnings = references
    .filter((reference) => statusByPath.get(reference.path) !== "available")
    .map((reference) => ({
      severity: "warning",
      code: "IMAGE_ASSET_NOT_FOUND",
      message: `Image asset could not be loaded: "${reference.path}".`,
      context: reference,
    }));

  return {
    valid: true,
    errors: [],
    warnings,
    checkedCount: uniquePaths.length,
  };
}

function collectImageReferences(project) {
  const references = [];

  if (!project?.containers) {
    return references;
  }

  Object.entries(project.containers).forEach(([containerId, container]) => {
    if (!Array.isArray(container?.layout)) {
      return;
    }

    container.layout.forEach((entry, entryIndex) => {
      if (typeof entry?.image !== "string" || !entry.image.trim()) {
        return;
      }

      const fileName = entry.image.trim();

      references.push({
        path: getImagePath(fileName),
        fileName,
        containerId,
        entryIndex,
        entryType: entry.type || "unknown",
      });
    });
  });

  return references;
}

function checkImage(path) {
  return new Promise((resolve) => {
    const image = new Image();
    let completed = false;

    const timeoutId = window.setTimeout(() => {
      finish("unavailable");
    }, ASSET_TIMEOUT_MS);

    function finish(status) {
      if (completed) {
        return;
      }

      completed = true;
      window.clearTimeout(timeoutId);

      image.onload = null;
      image.onerror = null;

      resolve(status);
    }

    image.onload = () => finish("available");
    image.onerror = () => finish("unavailable");

    image.src = path;
  });
}
