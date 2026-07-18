"use strict";

export class ProjectModel {
  #data;

  constructor(projectData) {
    if (!projectData || typeof projectData !== "object") {
      throw new ProjectModelError(
        "PROJECT_DATA_INVALID",
        "ProjectModel requires valid project data.",
      );
    }

    /*
      Create an internal copy so outside code cannot accidentally
      mutate the object returned by the Project Loader.
    */
    this.#data = structuredClone(projectData);
  }

  // =========================================
  // Project Information
  // =========================================

  get startContainerId() {
    return this.#data.startContainer;
  }

  hasContainer(containerId) {
    return Object.hasOwn(this.#data.containers || {}, containerId);
  }

  getContainerIds() {
    return Object.keys(this.#data.containers || {});
  }

  // =========================================
  // Container Access
  // =========================================

  getContainer(containerId) {
    const container = this.#getContainerReference(containerId);

    return container ? structuredClone(container) : null;
  }

  getRootContainer() {
    return this.getContainer(this.startContainerId);
  }

  getParent(containerId) {
    const container = this.#getContainerReference(containerId);

    if (!container?.parent) {
      return null;
    }

    return this.getContainer(container.parent);
  }

  getChildren(containerId) {
    const container = this.#getContainerReference(containerId);

    if (!container) {
      return [];
    }

    const childIds = Array.isArray(container.children) ? container.children : [];

    return childIds.map((childId) => this.getContainer(childId)).filter(Boolean);
  }

  getChildIds(containerId) {
    const container = this.#getContainerReference(containerId);

    if (!container || !Array.isArray(container.children)) {
      return [];
    }

    return [...container.children];
  }

  // =========================================
  // Container State
  // =========================================

  isContainerActive(containerId) {
    const container = this.#getContainerReference(containerId);

    return Boolean(container) && container.active !== false;
  }

  isContainerAccessible(containerId) {
    let currentId = containerId;
    const visited = new Set();

    while (currentId) {
      if (visited.has(currentId)) {
        return false;
      }

      visited.add(currentId);

      const container = this.#getContainerReference(currentId);

      if (!container || container.active === false) {
        return false;
      }

      if (!container.parent) {
        return currentId === this.startContainerId;
      }

      currentId = container.parent;
    }

    return false;
  }

  // =========================================
  // Layout Access
  // =========================================

  getLayout(containerId) {
    const container = this.#getContainerReference(containerId);

    if (!container || !Array.isArray(container.layout)) {
      return [];
    }

    return structuredClone(container.layout);
  }

  getLayoutEntry(containerId, entryIndex) {
    const layout = this.getLayout(containerId);

    if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex >= layout.length) {
      return null;
    }

    return layout[entryIndex];
  }

  // =========================================
  // Serialization and Validation Support
  // =========================================

  toObject() {
    return structuredClone(this.#data);
  }

  serialize(spaces = 2) {
    return JSON.stringify(this.#data, null, spaces);
  }

  // =========================================
  // Internal Access
  // =========================================

  #getContainerReference(containerId) {
    if (typeof containerId !== "string" || !containerId.trim()) {
      return null;
    }

    return this.#data.containers?.[containerId] || null;
  }
}

export class ProjectModelError extends Error {
  constructor(code, message, cause = null) {
    super(message);

    this.name = "ProjectModelError";
    this.code = code;
    this.cause = cause;
  }
}
