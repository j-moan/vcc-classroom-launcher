"use strict";

const WORKING_PROJECT_STORAGE_KEY = "vcc.workingProject";
const PUBLISHED_PROJECT_STORAGE_KEY = "vcc.publishedProject";

export function loadWorkingProjectData() {
  const workingProject = window.localStorage.getItem(WORKING_PROJECT_STORAGE_KEY);

  if (!workingProject) {
    return null;
  }

  try {
    return JSON.parse(workingProject);
  } catch (error) {
    console.error("Stored teacher project could not be parsed.", error);
    return null;
  }
}

export function saveWorkingProjectData(projectData) {
  if (!projectData || typeof projectData !== "object") {
    throw new Error("Teacher project data must be an object.");
  }

  const serializedProject = JSON.stringify(projectData);

  window.localStorage.setItem(WORKING_PROJECT_STORAGE_KEY, serializedProject);
}

export function clearWorkingProjectData() {
  window.localStorage.removeItem(WORKING_PROJECT_STORAGE_KEY);
}

export function hasWorkingProjectData() {
  return window.localStorage.getItem(WORKING_PROJECT_STORAGE_KEY) !== null;
}

export function loadPublishedProjectData() {
  const publishedProject = window.localStorage.getItem(PUBLISHED_PROJECT_STORAGE_KEY);

  return publishedProject ? JSON.parse(publishedProject) : null;
}

export function publishProject(projectData) {
  window.localStorage.setItem(PUBLISHED_PROJECT_STORAGE_KEY, JSON.stringify(projectData));
}
