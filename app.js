"use strict";

/*
  VCC Classroom Launcher
  Application rendering and interaction logic
*/

const site = window.CLASSROOM_SITE;

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const pageSections = document.getElementById("pageSections");
const homeButton = document.getElementById("homeButton");
const backButton = document.getElementById("backButton");
const messageBox = document.getElementById("messageBox");

let currentPageId = site.startPage;

/*
  Starts the application.
*/
function initialize() {
  renderPage(site.startPage);
}

/*
  Builds and displays one complete classroom page.
*/
function renderPage(pageId) {
  const page = site.pages[pageId];

  if (!page) {
    showMessage(`The page "${pageId}" could not be found.`);
    return;
  }

  currentPageId = pageId;
  pageSections.setAttribute("aria-busy", "true");

  updatePageHeader(page);
  updateNavigation(page);
  clearPage();

  page.sections.forEach((section) => {
    renderSection(section, page.columns);
  });

  pageSections.setAttribute("aria-busy", "false");
}

/*
  Updates the title and optional subtitle.
*/
function updatePageHeader(page) {
  pageTitle.textContent = page.header;
  document.title = `${page.header} | VCC Classroom Launcher`;

  pageSubtitle.hidden = true;
}

/*
  Shows or hides the Home and Back controls.
*/
function updateNavigation(page) {
  const isHomePage = currentPageId === site.startPage;

  homeButton.hidden = isHomePage;
  backButton.hidden = !page.parent;
}

/*
  Removes the previously displayed page content.
*/
function clearPage() {
  pageSections.replaceChildren();
}

/*
  Builds one section and its collection of tiles.
*/
function renderSection(section, defaultColumns) {
  const sectionElement = document.createElement("section");
  sectionElement.className = "page-section";

  if (section.heading) {
    const heading = document.createElement("h2");
    heading.className = "section-heading";
    heading.textContent = section.heading;
    sectionElement.appendChild(heading);
  }

  if (section.description) {
    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = section.description;
    sectionElement.appendChild(description);
  }

  const tileGrid = document.createElement("div");
  tileGrid.className = "tile-grid";

  const columns = section.columns || defaultColumns || 4;
  tileGrid.style.setProperty("--page-columns", columns);

  section.tiles.forEach((tile) => {
    tileGrid.appendChild(renderTile(tile));
  });

  sectionElement.appendChild(tileGrid);
  pageSections.appendChild(sectionElement);
}

/*
  Builds one image-and-label classroom tile.
*/
function renderTile(tileData) {
  const tile = document.createElement("button");

  tile.type = "button";
  tile.className = "classroom-tile";
  tile.setAttribute("aria-label", tileData.label);

  const imageFrame = document.createElement("span");
  imageFrame.className = "tile-image-frame";

  const image = document.createElement("img");
  image.className = "tile-image tile-image-cover";
  image.src = tileData.image;
  image.alt = tileData.label;

  imageFrame.appendChild(image);

  const label = document.createElement("span");
  label.className = "tile-label";
  label.textContent = tileData.label;

  tile.append(imageFrame, label);

  tile.addEventListener("click", () => {
    handleTileSelection(tileData);
  });

  return tile;
}

/*
  Determines what happens when a tile is selected.
*/
function handleTileSelection(tileData) {
  if (tileData.type === "page") {
    renderPage(tileData.target);
    return;
  }

  if (tileData.type === "video") {
    showMessage(`Video selected: ${tileData.label}`);
    return;
  }

  showMessage(`Unsupported tile type: ${tileData.type}`);
}

/*
  Displays a temporary alert message.
*/
function showMessage(message) {
  messageBox.textContent = message;
  messageBox.hidden = false;

  window.setTimeout(() => {
    messageBox.hidden = true;
  }, 4000);
}

/*
  Navigation controls
*/

homeButton.addEventListener("click", () => {
  renderPage(site.startPage);
});

backButton.addEventListener("click", () => {
  const currentPage = site.pages[currentPageId];

  if (currentPage?.parent) {
    renderPage(currentPage.parent);
  }
});

/*
  Start the application.
*/

initialize();
