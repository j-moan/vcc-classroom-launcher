"use strict";

import { ProjectModel, ProjectModelError } from "../models/project-model.js";

export async function loadProject() {
  const projectData = window.CLASSROOM_SITE;

  if (!projectData) {
    throw new ProjectLoadError("PROJECT_NOT_FOUND", "No classroom project data was found.");
  }

  if (typeof projectData !== "object" || Array.isArray(projectData)) {
    throw new ProjectLoadError("PROJECT_INVALID", "The classroom project data must be an object.");
  }

  try {
    return new ProjectModel(projectData);
  } catch (error) {
    if (error instanceof ProjectModelError) {
      throw new ProjectLoadError(error.code, error.message, error);
    }

    throw new ProjectLoadError(
      "PROJECT_MODEL_CREATION_FAILED",
      "The classroom Project Model could not be created.",
      error,
    );
  }
}

export class ProjectLoadError extends Error {
  constructor(code, message, cause = null) {
    super(message);

    this.name = "ProjectLoadError";
    this.code = code;
    this.cause = cause;
  }
}
