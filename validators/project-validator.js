"use strict";

const SUPPORTED_LAYOUT_TYPES = new Set([
  "navigation",
  "section",
  "video",
  "website",
  "pdf",
  "powerpoint",
  "image",
  "information",
  "placeholder",
]);

const CONTENT_TYPES_REQUIRING_TARGET = new Set(["video", "website", "pdf", "powerpoint", "image"]);

export function validateProject(project) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
  };

  validateProjectRoot(project, result);

  if (!project || typeof project !== "object") {
    return finalizeResult(result);
  }

  if (
    !project.containers ||
    typeof project.containers !== "object" ||
    Array.isArray(project.containers)
  ) {
    return finalizeResult(result);
  }

  validateStartContainer(project, result);
  validateContainers(project, result);
  validateContainerRelationships(project, result);
  validateContainerCycles(project, result);
  validateNavigationEntries(project, result);

  return finalizeResult(result);
}

function validateProjectRoot(project, result) {
  if (!project) {
    addError(result, "PROJECT_MISSING", "Project data is missing.");
    return;
  }

  if (typeof project !== "object" || Array.isArray(project)) {
    addError(result, "PROJECT_INVALID", "Project data must be an object.");
    return;
  }

  if (
    !project.containers ||
    typeof project.containers !== "object" ||
    Array.isArray(project.containers)
  ) {
    addError(result, "CONTAINERS_INVALID", 'Project data must contain a "containers" object.');
  }
}

function validateStartContainer(project, result) {
  if (typeof project.startContainer !== "string" || !project.startContainer.trim()) {
    addError(
      result,
      "START_CONTAINER_MISSING",
      'Project data must define a non-empty "startContainer".',
    );
    return;
  }

  if (!project.containers[project.startContainer]) {
    addError(
      result,
      "START_CONTAINER_NOT_FOUND",
      `The start Container "${project.startContainer}" does not exist.`,
      {
        containerId: project.startContainer,
      },
    );
    return;
  }

  const startContainer = project.containers[project.startContainer];

  if (startContainer.parent !== null) {
    addWarning(
      result,
      "START_CONTAINER_HAS_PARENT",
      `The start Container "${project.startContainer}" should have a null parent.`,
      {
        containerId: project.startContainer,
      },
    );
  }

  if (startContainer.active === false) {
    addError(
      result,
      "START_CONTAINER_INACTIVE",
      `The start Container "${project.startContainer}" cannot be inactive.`,
      {
        containerId: project.startContainer,
      },
    );
  }
}

function validateContainers(project, result) {
  const containerEntries = Object.entries(project.containers);

  if (containerEntries.length === 0) {
    addError(result, "NO_CONTAINERS", "The project must contain at least one Container.");

    return;
  }

  containerEntries.forEach(([containerId, container]) => {
    validateContainer(containerId, container, result);
  });
}

function validateContainer(containerId, container, result) {
  if (!container || typeof container !== "object" || Array.isArray(container)) {
    addError(result, "CONTAINER_INVALID", `Container "${containerId}" must be an object.`, {
      containerId,
    });

    return;
  }

  if (typeof container.title !== "string" || !container.title.trim()) {
    addError(result, "CONTAINER_TITLE_MISSING", `Container "${containerId}" must have a title.`, {
      containerId,
    });
  }

  if (container.parent !== null && typeof container.parent !== "string") {
    addError(
      result,
      "CONTAINER_PARENT_INVALID",
      `Container "${containerId}" must have a string parent or null.`,
      {
        containerId,
      },
    );
  }

  if (container.active !== undefined && typeof container.active !== "boolean") {
    addError(
      result,
      "CONTAINER_ACTIVE_INVALID",
      `Container "${containerId}" has an invalid active value.`,
      {
        containerId,
      },
    );
  }

  if (container.children !== undefined && !Array.isArray(container.children)) {
    addError(
      result,
      "CONTAINER_CHILDREN_INVALID",
      `Container "${containerId}" must define children as an array.`,
      {
        containerId,
      },
    );
  }

  if (container.layout !== undefined && !Array.isArray(container.layout)) {
    addError(
      result,
      "CONTAINER_LAYOUT_INVALID",
      `Container "${containerId}" must define layout as an array.`,
      {
        containerId,
      },
    );

    return;
  }

  validateChildrenArray(containerId, container.children || [], result);
  validateLayout(containerId, container.layout || [], result);
}

function validateChildrenArray(containerId, children, result) {
  const seenChildren = new Set();

  children.forEach((childId, childIndex) => {
    if (typeof childId !== "string" || !childId.trim()) {
      addError(
        result,
        "CHILD_ID_INVALID",
        `Container "${containerId}" has an invalid child at index ${childIndex}.`,
        {
          containerId,
          childIndex,
        },
      );

      return;
    }

    if (seenChildren.has(childId)) {
      addWarning(
        result,
        "DUPLICATE_CHILD",
        `Container "${containerId}" lists child "${childId}" more than once.`,
        {
          containerId,
          childId,
        },
      );
    }

    seenChildren.add(childId);
  });
}

function validateLayout(containerId, layout, result) {
  layout.forEach((entry, entryIndex) => {
    validateLayoutEntry(containerId, entry, entryIndex, result);
  });
}

function validateLayoutEntry(containerId, entry, entryIndex, result) {
  const context = {
    containerId,
    entryIndex,
  };

  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    addError(
      result,
      "LAYOUT_ENTRY_INVALID",
      `Container "${containerId}" has an invalid layout entry at index ${entryIndex}.`,
      context,
    );

    return;
  }

  if (typeof entry.type !== "string" || !entry.type.trim()) {
    addError(
      result,
      "LAYOUT_TYPE_MISSING",
      `Container "${containerId}" has a layout entry with no type at index ${entryIndex}.`,
      context,
    );

    return;
  }

  if (!SUPPORTED_LAYOUT_TYPES.has(entry.type)) {
    addError(
      result,
      "LAYOUT_TYPE_UNSUPPORTED",
      `Container "${containerId}" uses unsupported layout type "${entry.type}" at index ${entryIndex}.`,
      {
        ...context,
        entryType: entry.type,
      },
    );

    return;
  }

  switch (entry.type) {
    case "navigation":
      validateNavigationEntryShape(entry, result, context);
      break;

    case "section":
      validateSectionEntry(entry, result, context);
      break;

    default:
      validateContentEntry(entry, result, context);
      break;
  }
}

function validateNavigationEntryShape(entry, result, context) {
  if (typeof entry.container !== "string" || !entry.container.trim()) {
    addError(
      result,
      "NAVIGATION_CONTAINER_MISSING",
      "A navigation entry must reference a child Container.",
      context,
    );
  }

  if (entry.label !== undefined) {
    addWarning(
      result,
      "NAVIGATION_LABEL_IGNORED",
      "Navigation labels come from the referenced Container title. The entry label will be ignored.",
      context,
    );
  }
}

function validateSectionEntry(entry, result, context) {
  const hasLabel = typeof entry.label === "string" && entry.label.trim().length > 0;

  if (!hasLabel) {
    addWarning(result, "EMPTY_SECTION", "A section entry does not have a label.", context);
  }
}

function validateContentEntry(entry, result, context) {
  const label =
    typeof entry.label === "string"
      ? entry.label.trim()
      : typeof entry.title === "string"
        ? entry.title.trim()
        : "";

  if (!label) {
    addWarning(result, "CONTENT_LABEL_MISSING", `A "${entry.type}" entry has no label or title.`, {
      ...context,
      entryType: entry.type,
    });
  }

  if (
    CONTENT_TYPES_REQUIRING_TARGET.has(entry.type) &&
    (typeof entry.target !== "string" || !entry.target.trim())
  ) {
    addWarning(result, "CONTENT_TARGET_MISSING", `The "${entry.type}" entry has no target.`, {
      ...context,
      entryType: entry.type,
    });
  }

  if (entry.image !== undefined && typeof entry.image !== "string") {
    addError(result, "CONTENT_IMAGE_INVALID", `The "${entry.type}" entry image must be a string.`, {
      ...context,
      entryType: entry.type,
    });
  }
}

function validateContainerRelationships(project, result) {
  const containers = project.containers;

  Object.entries(containers).forEach(([containerId, container]) => {
    if (!container || typeof container !== "object") {
      return;
    }

    if (container.parent) {
      const parentContainer = containers[container.parent];

      if (!parentContainer) {
        addError(
          result,
          "PARENT_NOT_FOUND",
          `Container "${containerId}" references missing parent "${container.parent}".`,
          {
            containerId,
            parentId: container.parent,
          },
        );
      } else if (
        Array.isArray(parentContainer.children) &&
        !parentContainer.children.includes(containerId)
      ) {
        addWarning(
          result,
          "PARENT_CHILD_MISMATCH",
          `Container "${containerId}" names "${container.parent}" as its parent, but the parent does not list it as a child.`,
          {
            containerId,
            parentId: container.parent,
          },
        );
      }
    }

    const children = Array.isArray(container.children) ? container.children : [];

    children.forEach((childId) => {
      const childContainer = containers[childId];

      if (!childContainer) {
        addError(
          result,
          "CHILD_NOT_FOUND",
          `Container "${containerId}" references missing child "${childId}".`,
          {
            containerId,
            childId,
          },
        );

        return;
      }

      if (childContainer.parent !== containerId) {
        addError(
          result,
          "CHILD_PARENT_MISMATCH",
          `Container "${containerId}" lists "${childId}" as a child, but that Container names "${childContainer.parent}" as its parent.`,
          {
            containerId,
            childId,
            declaredParentId: childContainer.parent,
          },
        );
      }
    });
  });
}

function validateContainerCycles(project, result) {
  const containers = project.containers;
  const complete = new Set();
  const reportedCycles = new Set();

  Object.keys(containers).forEach((containerId) => {
    if (complete.has(containerId)) {
      return;
    }

    const currentPath = [];
    const currentPathIndexes = new Map();
    let currentId = containerId;

    while (currentId && containers[currentId]) {
      if (complete.has(currentId)) {
        break;
      }

      if (currentPathIndexes.has(currentId)) {
        const cycleStartIndex = currentPathIndexes.get(currentId);
        const cycle = currentPath.slice(cycleStartIndex);
        cycle.push(currentId);

        const cycleKey = normalizeCycleKey(cycle);

        if (!reportedCycles.has(cycleKey)) {
          addError(
            result,
            "CONTAINER_CYCLE",
            `Circular Container hierarchy detected: ${cycle.join(" → ")}.`,
            {
              containerIds: cycle,
            },
          );

          reportedCycles.add(cycleKey);
        }

        break;
      }

      currentPathIndexes.set(currentId, currentPath.length);
      currentPath.push(currentId);

      currentId = containers[currentId].parent;
    }

    currentPath.forEach((visitedId) => {
      complete.add(visitedId);
    });
  });
}

function validateNavigationEntries(project, result) {
  const containers = project.containers;

  Object.entries(containers).forEach(([containerId, container]) => {
    if (!container || !Array.isArray(container.layout)) {
      return;
    }

    const navigationCounts = new Map();

    container.layout.forEach((entry, entryIndex) => {
      if (entry?.type !== "navigation") {
        return;
      }

      const childId = entry.container;

      if (typeof childId !== "string" || !childId.trim()) {
        return;
      }

      navigationCounts.set(childId, (navigationCounts.get(childId) || 0) + 1);

      const childContainer = containers[childId];

      if (!childContainer) {
        addError(
          result,
          "NAVIGATION_TARGET_NOT_FOUND",
          `Container "${containerId}" has a navigation entry for missing Container "${childId}".`,
          {
            containerId,
            childId,
            entryIndex,
          },
        );

        return;
      }

      if (childContainer.parent !== containerId) {
        addError(
          result,
          "NAVIGATION_NOT_DIRECT_CHILD",
          `Container "${containerId}" has a navigation entry for "${childId}", but it is not a direct child.`,
          {
            containerId,
            childId,
            entryIndex,
          },
        );
      }
    });

    navigationCounts.forEach((count, childId) => {
      if (count > 1) {
        addWarning(
          result,
          "DUPLICATE_NAVIGATION_ENTRY",
          `Container "${containerId}" has ${count} navigation entries for child "${childId}".`,
          {
            containerId,
            childId,
          },
        );
      }
    });

    const children = Array.isArray(container.children) ? container.children : [];

    children.forEach((childId) => {
      const childContainer = containers[childId];

      if (!childContainer || childContainer.active === false) {
        return;
      }

      if (!navigationCounts.has(childId)) {
        addWarning(
          result,
          "CHILD_NAVIGATION_MISSING",
          `Active child Container "${childId}" has no navigation entry in parent "${containerId}".`,
          {
            containerId,
            childId,
          },
        );
      }
    });
  });
}

function normalizeCycleKey(cycle) {
  const uniqueCycle = cycle.slice(0, -1);

  if (uniqueCycle.length === 0) {
    return "";
  }

  const rotations = uniqueCycle.map((_, index) => {
    return [...uniqueCycle.slice(index), ...uniqueCycle.slice(0, index)].join("|");
  });

  rotations.sort();

  return rotations[0];
}

function addError(result, code, message, context = {}) {
  result.errors.push({
    severity: "error",
    code,
    message,
    context,
  });
}

function addWarning(result, code, message, context = {}) {
  result.warnings.push({
    severity: "warning",
    code,
    message,
    context,
  });
}

function finalizeResult(result) {
  result.valid = result.errors.length === 0;
  return result;
}
