"use strict";

export class ProjectModel {
  #data;
  #listeners = new Map();

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
  // Project Event Bus
  // =========================================

  on(eventName, handler) {
    this.#validateEventSubscription(eventName, handler);

    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, new Set());
    }

    this.#listeners.get(eventName).add(handler);

    return () => {
      this.off(eventName, handler);
    };
  }

  off(eventName, handler) {
    const handlers = this.#listeners.get(eventName);

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.#listeners.delete(eventName);
    }
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

  getContainerTree() {
    return this.#buildContainerTree(this.startContainerId);
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
  // Container Editing
  // =========================================

  createContainer({ title, parentId, subtitle = "", active = true, navigationImage = "" }) {
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!normalizedTitle) {
      throw new ProjectModelError("CONTAINER_TITLE_REQUIRED", "A new Container must have a title.");
    }

    const parent = this.#getContainerReference(parentId);

    if (!parent) {
      throw new ProjectModelError(
        "PARENT_CONTAINER_NOT_FOUND",
        `The parent Container "${parentId}" does not exist.`,
      );
    }

    if (typeof subtitle !== "string") {
      throw new ProjectModelError(
        "CONTAINER_SUBTITLE_INVALID",
        "The Container subtitle must be a string.",
      );
    }

    if (typeof active !== "boolean") {
      throw new ProjectModelError(
        "CONTAINER_ACTIVE_INVALID",
        "The Container active state must be a boolean.",
      );
    }

    if (typeof navigationImage !== "string") {
      throw new ProjectModelError(
        "NAVIGATION_IMAGE_INVALID",
        "The navigation image must be a string.",
      );
    }

    const containerId = this.#createUniqueContainerId(normalizedTitle);

    this.#data.containers[containerId] = {
      title: normalizedTitle,
      subtitle: subtitle.trim(),
      parent: parentId,
      active,
      children: [],
      layout: [],
    };

    if (!Array.isArray(parent.children)) {
      parent.children = [];
    }

    parent.children.push(containerId);

    if (!Array.isArray(parent.layout)) {
      parent.layout = [];
    }

    parent.layout.push({
      type: "navigation",
      container: containerId,
      image: navigationImage.trim(),
    });

    this.#emit("containerCreated", {
      containerId,
      parentId,
    });

    return containerId;
  }

  renameContainer(containerId, newTitle) {
    const container = this.#getContainerReference(containerId);

    if (!container) {
      throw new ProjectModelError(
        "CONTAINER_NOT_FOUND",
        `Container "${containerId}" does not exist.`,
      );
    }

    const normalizedTitle = typeof newTitle === "string" ? newTitle.trim() : "";

    if (!normalizedTitle) {
      throw new ProjectModelError("CONTAINER_TITLE_REQUIRED", "Container title cannot be empty.");
    }

    const oldTitle = container.title;

    if (oldTitle === normalizedTitle) {
      return;
    }

    container.title = normalizedTitle;

    this.#emit("containerRenamed", {
      containerId,
      oldTitle,
      newTitle: normalizedTitle,
    });
  }

  deleteContainer(containerId) {
    if (containerId === this.startContainerId) {
      throw new ProjectModelError(
        "ROOT_CONTAINER_DELETE_NOT_ALLOWED",
        "The Home page cannot be deleted.",
      );
    }

    const container = this.#getContainerReference(containerId);

    if (!container) {
      throw new ProjectModelError(
        "CONTAINER_NOT_FOUND",
        `Container "${containerId}" does not exist.`,
      );
    }

    if (Array.isArray(container.children) && container.children.length > 0) {
      throw new ProjectModelError(
        "CONTAINER_HAS_CHILDREN",
        "This page cannot be deleted because it has subpages.",
      );
    }
    const layout = Array.isArray(container.layout) ? container.layout : [];

    if (layout.length > 0) {
      throw new ProjectModelError(
        "CONTAINER_NOT_EMPTY",
        "This page cannot be deleted because it is not empty.",
      );
    }

    const parentId = container.parent;
    const parent = this.#getContainerReference(parentId);

    if (!parent) {
      throw new ProjectModelError(
        "PARENT_CONTAINER_NOT_FOUND",
        `The parent Container "${parentId}" does not exist.`,
      );
    }

    if (Array.isArray(parent.children)) {
      parent.children = parent.children.filter((childId) => childId !== containerId);
    }

    if (Array.isArray(parent.layout)) {
      parent.layout = parent.layout.filter(
        (entry) => !(entry.type === "navigation" && entry.container === containerId),
      );
    }

    delete this.#data.containers[containerId];

    this.#emit("containerDeleted", {
      containerId,
      parentId,
    });

    return parentId;
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
  // Layout Editing
  // =========================================

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
  // Event Helpers
  // =========================================

  #validateEventSubscription(eventName, handler) {
    if (typeof eventName !== "string" || !eventName.trim()) {
      throw new ProjectModelError(
        "EVENT_NAME_INVALID",
        "Project event name must be a non-empty string.",
      );
    }

    if (typeof handler !== "function") {
      throw new ProjectModelError(
        "EVENT_HANDLER_INVALID",
        "Project event handler must be a function.",
      );
    }
  }

  #emit(eventName, payload = {}) {
    const handlers = this.#listeners.get(eventName);

    if (!handlers || handlers.size === 0) {
      return;
    }

    const event = Object.freeze({
      type: eventName,
      timestamp: new Date().toISOString(),
      ...structuredClone(payload),
    });

    handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Project event handler failed for "${eventName}".`, error);
      }
    });
  }

  // =========================================
  // Container ID Helpers
  // =========================================

  #createUniqueContainerId(title) {
    const baseId = this.#createContainerIdBase(title);

    if (!this.hasContainer(baseId)) {
      return baseId;
    }

    let suffix = 2;
    let candidateId = `${baseId}-${suffix}`;

    while (this.hasContainer(candidateId)) {
      suffix += 1;
      candidateId = `${baseId}-${suffix}`;
    }

    return candidateId;
  }

  #createContainerIdBase(title) {
    const normalizedId = title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return normalizedId || "container";
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

  #buildContainerTree(containerId) {
    const container = this.#getContainerReference(containerId);

    if (!container) {
      return null;
    }

    return {
      id: containerId,
      title: container.title,
      active: container.active !== false,
      children: this.getChildIds(containerId)
        .map((childId) => this.#buildContainerTree(childId))
        .filter(Boolean),
    };
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
