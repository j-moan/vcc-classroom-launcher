"use strict";

const SUPPORTED_EVENTS = ["containerCreated", "containerRenamed"];

export class ProjectHistory {
  #entries = [];
  #nextSequence = 1;
  #unsubscribeFunctions = [];
  #maximumEntries;

  constructor(project, { maximumEntries = 500 } = {}) {
    if (!project || typeof project.on !== "function") {
      throw new ProjectHistoryError(
        "PROJECT_INVALID",
        "ProjectHistory requires a Project Model with event support.",
      );
    }

    if (!Number.isInteger(maximumEntries) || maximumEntries < 1) {
      throw new ProjectHistoryError(
        "MAXIMUM_ENTRIES_INVALID",
        "ProjectHistory maximumEntries must be a positive integer.",
      );
    }

    this.#maximumEntries = maximumEntries;

    SUPPORTED_EVENTS.forEach((eventName) => {
      const unsubscribe = project.on(eventName, (event) => {
        this.#record(event);
      });

      this.#unsubscribeFunctions.push(unsubscribe);
    });
  }

  // =========================================
  // History Access
  // =========================================

  getEntries() {
    return structuredClone(this.#entries);
  }

  getLatestEntry() {
    const latestEntry = this.#entries[this.#entries.length - 1];

    return latestEntry ? structuredClone(latestEntry) : null;
  }

  get count() {
    return this.#entries.length;
  }

  // =========================================
  // History Management
  // =========================================

  clear() {
    this.#entries = [];
    this.#nextSequence = 1;
  }

  dispose() {
    this.#unsubscribeFunctions.forEach((unsubscribe) => {
      unsubscribe();
    });

    this.#unsubscribeFunctions = [];
  }

  // =========================================
  // Internal Recording
  // =========================================

  #record(event) {
    const entry = Object.freeze({
      sequence: this.#nextSequence,
      ...structuredClone(event),
    });

    this.#nextSequence += 1;
    this.#entries.push(entry);

    if (this.#entries.length > this.#maximumEntries) {
      this.#entries.shift();
    }
  }
}

export class ProjectHistoryError extends Error {
  constructor(code, message, cause = null) {
    super(message);

    this.name = "ProjectHistoryError";
    this.code = code;
    this.cause = cause;
  }
}
