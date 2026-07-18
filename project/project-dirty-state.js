"use strict";

const MODIFYING_EVENTS = ["containerCreated", "containerRenamed"];

export class ProjectDirtyState {
  #dirty = false;
  #unsubscribeFunctions = [];

  constructor(project) {
    if (!project || typeof project.on !== "function") {
      throw new ProjectDirtyStateError(
        "PROJECT_INVALID",
        "ProjectDirtyState requires a Project Model with event support.",
      );
    }

    MODIFYING_EVENTS.forEach((eventName) => {
      const unsubscribe = project.on(eventName, () => {
        this.#dirty = true;
      });

      this.#unsubscribeFunctions.push(unsubscribe);
    });
  }

  // =========================================
  // Dirty State
  // =========================================

  isDirty() {
    return this.#dirty;
  }

  clear() {
    this.#dirty = false;
  }

  dispose() {
    this.#unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());

    this.#unsubscribeFunctions = [];
  }
}

export class ProjectDirtyStateError extends Error {
  constructor(code, message, cause = null) {
    super(message);

    this.name = "ProjectDirtyStateError";
    this.code = code;
    this.cause = cause;
  }
}
