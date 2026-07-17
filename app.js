"use strict";

/*
  VCC Classroom Launcher
  Student-mode rendering and interaction logic
*/

const site = window.CLASSROOM_SITE;

// =========================================
// Application Defaults
// =========================================

const DEFAULT_COLUMNS = 8;

// =========================================
// DOM References
// =========================================

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const pageSections = document.getElementById("pageSections");
const homeButton = document.getElementById("homeButton");
const backButton = document.getElementById("backButton");
const messageBox = document.getElementById("messageBox");

// =========================================
// Application State
// =========================================

let currentContainerId = site.startContainer;
let messageTimerId = null;

// =========================================
// Application Startup
// =========================================

function initialize() {
  if (!site || !site.containers) {
    showMessage("The classroom data could not be loaded.");
    return;
  }

  if (!site.startContainer) {
    showMessage("No starting classroom page has been configured.");
    return;
  }

  renderContainer(site.startContainer);
}

// =========================================
// Container Rendering
// =========================================

function renderContainer(containerId) {
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
  pageSections.setAttribute("aria-busy", "true");

  updateHeader(container);
  updateNavigation(container);
  clearPage();

  const layoutGrid = createLayoutGrid(container);
  pageSections.appendChild(layoutGrid);

  pageSections.setAttribute("aria-busy", "false");
}

// =========================================
// Header and Navigation
// =========================================

function updateHeader(container) {
  pageTitle.textContent = container.title;
  document.title = `${container.title} | VCC Classroom Launcher`;

  if (container.subtitle) {
    pageSubtitle.textContent = container.subtitle;
  } else {
    pageSubtitle.textContent = "";
  }

  // Subtitles remain hidden in the current student interface.
  pageSubtitle.hidden = true;
}

function updateNavigation(container) {
  const isHomeContainer = currentContainerId === site.startContainer;

  homeButton.hidden = isHomeContainer;
  backButton.hidden = isHomeContainer || !container.parent;
}

function navigateHome() {
  renderContainer(site.startContainer);
}

function navigateBack() {
  const currentContainer = getContainer(currentContainerId);

  if (!currentContainer?.parent) {
    return;
  }

  renderContainer(currentContainer.parent);
}

// =========================================
// Layout Rendering
// =========================================

function clearPage() {
  pageSections.replaceChildren();
}

function createLayoutGrid(container) {
  const grid = document.createElement("div");
  grid.className = "tile-grid";
  grid.style.setProperty("--page-columns", container.columns || DEFAULT_COLUMNS);

  const layout = Array.isArray(container.layout) ? container.layout : [];

  layout.forEach((entry) => {
    const element = renderLayoutEntry(entry, container);

    if (element) {
      grid.appendChild(element);
    }
  });

  return grid;
}

function renderLayoutEntry(entry, parentContainer) {
  if (!entry || !entry.type) {
    return null;
  }

  switch (entry.type) {
    case "navigation":
      return renderNavigationEntry(entry, parentContainer);

    case "section":
      return renderSectionEntry(entry);

    case "video":
      return renderContentTile(entry);

    case "website":
    case "pdf":
    case "powerpoint":
    case "image":
    case "information":
      return renderContentTile(entry);

    default:
      console.warn(`Unsupported layout entry type: ${entry.type}`);
      return null;
  }
}

// =========================================
// Navigation Entries
// =========================================

function renderNavigationEntry(entry, parentContainer) {
  const childContainer = getContainer(entry.container);

  if (!childContainer) {
    console.warn(`Navigation entry references missing container: ${entry.container}`);
    return null;
  }

  if (childContainer.parent !== currentContainerId) {
    console.warn(
      `Container "${entry.container}" is not a direct child of "${currentContainerId}".`,
    );
    return null;
  }

  if (!isContainerAccessible(entry.container)) {
    return null;
  }

  const tileData = {
    type: "navigation",
    label: childContainer.title,
    image: entry.image,
    target: entry.container,
  };

  return createTile(tileData);
}

// =========================================
// Section Entries
// =========================================

function renderSectionEntry(entry) {
  const section = document.createElement("section");
  section.className = "page-section";
  section.style.gridColumn = "1 / -1";

  if (entry.title) {
    const heading = document.createElement("h2");
    heading.className = "section-heading";
    heading.textContent = entry.title;
    section.appendChild(heading);
  }

  if (entry.description) {
    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = entry.description;
    section.appendChild(description);
  }

  return section;
}

// =========================================
// Content Entries
// =========================================

function renderContentTile(entry) {
  const tileData = {
    type: entry.type,
    label: entry.label || entry.title || "Untitled",
    image: entry.image,
    target: entry.target,
  };

  return createTile(tileData);
}

function createTile(tileData) {
  const tile = document.createElement("button");

  tile.type = "button";
  tile.className = "classroom-tile";
  tile.setAttribute("aria-label", tileData.label);

  const imageFrame = document.createElement("span");
  imageFrame.className = "tile-image-frame";

  if (tileData.image) {
    const image = document.createElement("img");
    image.className = "tile-image tile-image-cover";
    image.src = tileData.image;
    image.alt = tileData.label;

    image.addEventListener("error", () => {
      image.hidden = true;
    });

    imageFrame.appendChild(image);
  }

  const label = document.createElement("span");
  label.className = "tile-label";
  label.textContent = tileData.label;

  tile.append(imageFrame, label);

  tile.addEventListener("click", () => {
    handleTileSelection(tileData);
  });

  return tile;
}

// =========================================
// Tile Actions
// =========================================

function handleTileSelection(tileData) {
  switch (tileData.type) {
    case "navigation":
      renderContainer(tileData.target);
      break;

    case "video":
      showMessage(`Video selected: ${tileData.label}`);
      break;

    case "information":
      // Information entries intentionally perform no action.
      break;

    case "website":
    case "pdf":
    case "powerpoint":
    case "image":
      showMessage(`${tileData.label} selected.`);
      break;

    default:
      showMessage(`Unsupported content type: ${tileData.type}`);
  }
}

// =========================================
// Container Access
// =========================================

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

// =========================================
// Messages
// =========================================

function showMessage(message) {
  if (messageTimerId) {
    window.clearTimeout(messageTimerId);
  }

  messageBox.textContent = message;
  messageBox.hidden = false;

  messageTimerId = window.setTimeout(() => {
    messageBox.hidden = true;
    messageTimerId = null;
  }, 4000);
}

// =========================================
// Event Listeners
// =========================================

homeButton.addEventListener("click", navigateHome);
backButton.addEventListener("click", navigateBack);

// =========================================
// Start Application
// =========================================

initialize();
