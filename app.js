"use strict";

import { renderLayout } from "./renderers/layout-renderer.js";
import { validateProject } from "./validators/project-validator.js";
import { validateAssets } from "./validators/asset-validator.js";

const site = window.CLASSROOM_SITE;

const DEFAULT_COLUMNS = 8;

const elements = {
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  pageSections: document.getElementById("pageSections"),
  homeButton: document.getElementById("homeButton"),
  backButton: document.getElementById("backButton"),
  messageBox: document.getElementById("messageBox"),
};

let currentContainerId = null;
let messageTimerId = null;

async function initialize() {
  const projectValidation = validateProject(site);

  reportValidation(projectValidation);

  if (!projectValidation.valid) {
    showMessage(
      `The classroom project contains ${projectValidation.errors.length} validation error${
        projectValidation.errors.length === 1 ? "" : "s"
      }.`,
    );

    elements.pageTitle.textContent = "Classroom unavailable";
    elements.pageSections.replaceChildren();

    return;
  }

  // Render immediately. Missing assets should not delay Student Mode.
  navigateToContainer(site.startContainer);

  const assetValidation = await validateAssets(site);
  reportAssetValidation(assetValidation);
}

function reportValidation(validation) {
  if (validation.errors.length > 0) {
    console.group(`VCC validation errors (${validation.errors.length})`);

    validation.errors.forEach((issue) => {
      console.error(`[${issue.code}] ${issue.message}`, issue.context);
    });

    console.groupEnd();
  }

  if (validation.warnings.length > 0) {
    console.group(`VCC validation warnings (${validation.warnings.length})`);

    validation.warnings.forEach((issue) => {
      console.warn(`[${issue.code}] ${issue.message}`, issue.context);
    });

    console.groupEnd();
  }

  if (validation.errors.length === 0 && validation.warnings.length === 0) {
    console.info("VCC project validation passed.");
  }
}

function reportAssetValidation(validation) {
  if (validation.warnings.length > 0) {
    console.group(`VCC asset validation warnings (${validation.warnings.length})`);

    validation.warnings.forEach((issue) => {
      console.warn(`[${issue.code}] ${issue.message}`, issue.context);
    });

    console.groupEnd();

    return;
  }

  console.info(
    `VCC asset validation passed. ${validation.checkedCount} image asset${
      validation.checkedCount === 1 ? "" : "s"
    } checked.`,
  );
}

function navigateToContainer(containerId) {
  const container = getContainer(containerId);

  if (!container) {
    showMessage(`The classroom page "${containerId}" could not be found.`);
    return;
  }

  if (!isContainerAccessible(containerId)) {
    showMessage("That classroom page is not currently available.");
    return;
  }

  currentContainerId = containerId;

  updateHeader(container);
  updateNavigationButtons(container);
  renderCurrentContainer(container);
}

function renderCurrentContainer(container) {
  elements.pageSections.setAttribute("aria-busy", "true");
  elements.pageSections.replaceChildren();

  const renderedLayout = renderLayout({
    container,
    containerId: currentContainerId,
    defaultColumns: DEFAULT_COLUMNS,
    getContainer,
    isContainerAccessible,
    onNavigate: navigateToContainer,
    onAction: handleContentAction,
  });

  elements.pageSections.appendChild(renderedLayout);
  elements.pageSections.setAttribute("aria-busy", "false");
}

function updateHeader(container) {
  elements.pageTitle.textContent = container.title || "Classroom";
  document.title = `${container.title || "Classroom"} | VCC Classroom Launcher`;

  elements.pageSubtitle.textContent = container.subtitle || "";
  elements.pageSubtitle.hidden = true;
}

function updateNavigationButtons(container) {
  const isHome = currentContainerId === site.startContainer;

  elements.homeButton.hidden = isHome;
  elements.backButton.hidden = isHome || !container.parent;
}

function navigateHome() {
  navigateToContainer(site.startContainer);
}

function navigateBack() {
  const currentContainer = getContainer(currentContainerId);

  if (currentContainer?.parent) {
    navigateToContainer(currentContainer.parent);
  }
}

function handleContentAction(entry) {
  switch (entry.type) {
    case "video":
      showMessage(`Video selected: ${getEntryLabel(entry)}`);
      break;

    case "information":
      break;

    case "website":
    case "pdf":
    case "powerpoint":
    case "image":
      showMessage(`${getEntryLabel(entry)} selected.`);
      break;

    default:
      showMessage(`Unsupported content type: ${entry.type}`);
  }
}

function getEntryLabel(entry) {
  return entry.label || entry.title || "Untitled";
}

function getContainer(containerId) {
  return site.containers[containerId] || null;
}

function isContainerAccessible(containerId) {
  let container = getContainer(containerId);
  const visited = new Set();

  while (container) {
    if (container.active === false) {
      return false;
    }

    if (!container.parent) {
      return true;
    }

    if (visited.has(container.parent)) {
      console.error("A circular Container relationship was detected.");
      return false;
    }

    visited.add(container.parent);
    container = getContainer(container.parent);
  }

  return false;
}

function showMessage(message) {
  if (messageTimerId) {
    window.clearTimeout(messageTimerId);
  }

  elements.messageBox.textContent = message;
  elements.messageBox.hidden = false;

  messageTimerId = window.setTimeout(() => {
    elements.messageBox.hidden = true;
    messageTimerId = null;
  }, 4000);
}

elements.homeButton.addEventListener("click", navigateHome);
elements.backButton.addEventListener("click", navigateBack);

void initialize();
