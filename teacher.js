"use strict";

import { loadProject } from "./project/project-loader.js";
import { ProjectModel } from "./models/project-model.js";
import { loadWorkingProjectData, saveWorkingProjectData } from "./project/project-storage.js";
import { getImagePath, getDefaultTileImagePath } from "./utilities/asset-paths.js";

const publishButton = document.querySelector("#publish-button");
const previewButton = document.querySelector("#preview-button");
const toolbarButtons = document.querySelectorAll(".teacher-tool-button");
const containerTreeElement = document.querySelector("#containerTree");
const addSubpageButton = document.querySelector("#add-subpage-button");
const addSubpageDialog = document.querySelector("#add-subpage-dialog");
const addSubpageForm = document.querySelector("#add-subpage-form");
const subpageNameInput = document.querySelector("#subpage-name-input");
const cancelAddSubpageButton = document.querySelector("#cancel-add-subpage-button");
const renamePageButton = document.querySelector("#rename-page-button");
renamePageButton.addEventListener("click", openRenamePageDialog);
const deletePageButton = document.querySelector("#delete-page-button");
const messageDialog = document.querySelector("#message-dialog");
const messageDialogTitle = document.querySelector("#message-dialog-title");
const messageDialogText = document.querySelector("#message-dialog-text");
const messageDialogOkButton = document.querySelector("#message-dialog-ok-button");
const messageDialogCancelButton = document.querySelector("#message-dialog-cancel-button");
const addTileButton = document.querySelector("#add-tile-button");
const addTileDialog = document.querySelector("#add-tile-dialog");
const addTileForm = document.querySelector("#add-tile-form");
const tileNameInput = document.querySelector("#tile-name-input");
const tileTypeSelect = document.querySelector("#tile-type-select");
const tileThumbnailInput = document.querySelector("#tile-thumbnail-input");
const tileDestinationGroup = document.querySelector("#tile-destination-group");
const tileDestinationLabel = document.querySelector("#tile-destination-label");
const tileDestinationInput = document.querySelector("#tile-destination-input");
const cancelAddTileButton = document.querySelector("#cancel-add-tile-button");
const addSeparatorButton = document.querySelector("#add-separator-button");
const addSeparatorDialog = document.querySelector("#add-separator-dialog");
const addSeparatorForm = document.querySelector("#add-separator-form");
const separatorNameInput = document.querySelector("#separator-name-input");
const cancelAddSeparatorButton = document.querySelector("#cancel-add-separator-button");
const deleteItemButton = document.querySelector("#delete-item-button");
const moveItemUpButton = document.querySelector("#move-item-up-button");
const moveItemDownButton = document.querySelector("#move-item-down-button");
const tileThumbnailPreview = document.querySelector("#tile-thumbnail-preview");
const changeTileThumbnailButton = document.querySelector("#change-tile-thumbnail-button");
const imagePickerDialog = document.querySelector("#image-picker-dialog");
const imagePickerForm = document.querySelector("#image-picker-form");
const imageSearchInput = document.querySelector("#image-search-input");
const imagePickerList = document.querySelector("#image-picker-list");
const imagePickerPreview = document.querySelector("#image-picker-preview");
const imagePickerFileName = document.querySelector("#image-picker-file-name");
const cancelImagePickerButton = document.querySelector("#cancel-image-picker-button");
const selectImageButton = document.querySelector("#select-image-button");
const pdfPickerDialog = document.querySelector("#pdf-picker-dialog");
const pdfPickerForm = document.querySelector("#pdf-picker-form");
const pdfSearchInput = document.querySelector("#pdf-search-input");
const pdfPickerList = document.querySelector("#pdf-picker-list");
const cancelPdfPickerButton = document.querySelector("#cancel-pdf-picker-button");
const selectPdfButton = document.querySelector("#select-pdf-button");
const catalogAssetsButton = document.querySelector("#catalog-assets-button");

let project = null;
let selectedContainerId = null;
let selectedLayoutIndex = null;
let renamingPage = false;
let selectedImagePath = null;
let selectedPdf = null;
let assetsFolderHandle = null;

async function initializeTeacherView() {
  try {
    const workingProjectData = loadWorkingProjectData();

    if (workingProjectData) {
      project = new ProjectModel(workingProjectData);
    } else {
      project = await loadProject();

      saveWorkingProjectData(project.toObject());
    }

    const tree = project.getContainerTree();

    if (!tree) {
      showTreeMessage("The project does not contain a root page.");
      return;
    }

    renderContainerTree(tree);
  } catch (error) {
    console.error("Teacher View could not load the project.", error);
    showTreeMessage("The classroom project could not be loaded.");
  }
  selectContainer(project.startContainerId);
}

function renderContainerTree(tree) {
  containerTreeElement.replaceChildren();

  const treeList = document.createElement("ul");
  treeList.className = "container-tree-list container-tree-root";

  treeList.appendChild(createTreeNode(tree));

  containerTreeElement.appendChild(treeList);
}

function createTreeNode(node) {
  const listItem = document.createElement("li");
  listItem.className = "container-tree-item";

  const row = document.createElement("div");
  row.className = "container-tree-row";
  row.dataset.containerId = node.id;

  const hasChildren = node.children.length > 0;

  const toggleButton = document.createElement("button");
  toggleButton.className = "container-tree-toggle";
  toggleButton.type = "button";
  toggleButton.setAttribute(
    "aria-label",
    hasChildren ? `Collapse ${node.title}` : `${node.title} has no child pages`,
  );
  toggleButton.disabled = !hasChildren;
  toggleButton.textContent = hasChildren ? "▼" : "•";

  const selectButton = document.createElement("button");
  selectButton.className = "container-tree-select";
  selectButton.type = "button";
  selectButton.textContent = node.title || "Untitled Page";
  selectButton.dataset.containerId = node.id;

  if (!node.active) {
    row.classList.add("container-tree-row-inactive");
    selectButton.textContent += " (Inactive)";
  }

  selectButton.addEventListener("click", () => {
    selectContainer(node.id);
  });

  row.append(toggleButton, selectButton);
  listItem.appendChild(row);

  if (hasChildren) {
    const childList = document.createElement("ul");
    childList.className = "container-tree-list";

    node.children.forEach((childNode) => {
      childList.appendChild(createTreeNode(childNode));
    });

    listItem.appendChild(childList);

    toggleButton.addEventListener("click", () => {
      const isCollapsed = childList.hidden;

      childList.hidden = !isCollapsed;
      toggleButton.textContent = isCollapsed ? "▼" : "▶";

      toggleButton.setAttribute(
        "aria-label",
        `${isCollapsed ? "Collapse" : "Expand"} ${node.title}`,
      );
    });
  }

  return listItem;
}

function selectContainer(containerId) {
  selectedContainerId = containerId;

  document.querySelectorAll(".container-tree-row-selected").forEach((row) => {
    row.classList.remove("container-tree-row-selected");
  });

  const selectedRow = containerTreeElement.querySelector(
    `[data-container-id="${CSS.escape(containerId)}"]`,
  );

  selectedRow?.classList.add("container-tree-row-selected");

  showSelectedContainer(containerId);
}

function showSelectedContainer(containerId) {
  const container = project.getContainer(containerId);

  if (!container) {
    return;
  }

  const pagePanel = document.querySelector(".teacher-page-panel .teacher-panel-content");

  pagePanel.replaceChildren();

  const heading = document.createElement("h3");
  heading.className = "selected-page-title";
  heading.textContent = container.title || "Untitled Page";

  const layoutList = document.createElement("ol");
  layoutList.className = "teacher-layout-list";

  const layout = project.getLayout(containerId);

  selectedLayoutIndex = null;

  if (layout.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "teacher-layout-empty";
    emptyMessage.textContent = "This page has no sections or tiles.";

    pagePanel.append(heading, emptyMessage);
    return;
  }

  layout.forEach((entry, entryIndex) => {
    layoutList.appendChild(createLayoutRow(entry, entryIndex));
  });

  pagePanel.append(heading, layoutList);
}

function createLayoutRow(entry, entryIndex) {
  const row = document.createElement("li");
  row.className = "teacher-layout-row";
  row.dataset.layoutIndex = entryIndex;
  row.tabIndex = 0;

  const thumbnail = createLayoutThumbnail(entry);

  const icon = document.createElement("span");
  icon.className = "teacher-layout-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = getLayoutIcon(entry.type);

  const name = document.createElement("span");
  name.className = "teacher-layout-name";
  name.textContent = getLayoutName(entry);

  row.append(thumbnail, icon, name);

  row.addEventListener("click", () => {
    selectLayoutEntry(entryIndex);
  });

  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectLayoutEntry(entryIndex);
    }
  });

  return row;
}

function createLayoutThumbnail(entry) {
  const frame = document.createElement("div");
  frame.className = "teacher-layout-thumbnail-frame";

  if (entry.type === "section") {
    frame.classList.add("teacher-layout-thumbnail-section");
    frame.textContent = "Section";
    return frame;
  }

  const imageFileName = entry.image;

  const image = document.createElement("img");
  image.className = "teacher-layout-thumbnail";
  image.src = imageFileName ? getImagePath(imageFileName) : getDefaultTileImagePath();
  image.alt = "";

  image.addEventListener("error", () => {
    image.src = getDefaultTileImagePath();
  });

  frame.appendChild(image);

  return frame;
}

function getLayoutIcon(type) {
  const icons = {
    section: "────",
    navigation: "🧭",
    video: "▶️",
    image: "🖼️",
    website: "🌐",
    pdf: "📄",
    powerpoint: "📊",
    information: "ℹ️",
  };

  return icons[type] || "•";
}

function getLayoutName(entry) {
  if (entry.type === "navigation") {
    const targetContainer = project.getContainer(entry.container);

    return targetContainer?.title || "Missing Page";
  }

  return entry.label || "Untitled Item";
}

function selectLayoutEntry(entryIndex) {
  selectedLayoutIndex = entryIndex;

  document.querySelectorAll(".teacher-layout-row-selected").forEach((row) => {
    row.classList.remove("teacher-layout-row-selected");
  });

  const selectedRow = document.querySelector(
    `.teacher-layout-row[data-layout-index="${entryIndex}"]`,
  );

  selectedRow?.classList.add("teacher-layout-row-selected");
}

function showTreeMessage(message) {
  containerTreeElement.replaceChildren();

  const messageElement = document.createElement("p");
  messageElement.className = "teacher-tree-message";
  messageElement.textContent = message;

  containerTreeElement.appendChild(messageElement);
}

function openAddSubpageDialog() {
  renamingPage = false;
  if (!selectedContainerId) {
    showTeacherMessage("Select a page before adding a subpage.");
    return;
  }

  subpageNameInput.value = "";
  addSubpageDialog.showModal();

  window.requestAnimationFrame(() => {
    subpageNameInput.focus();
  });
}

function closeAddSubpageDialog() {
  subpageNameInput.value = "";

  if (addSubpageDialog.open) {
    addSubpageDialog.close();
  }
}

function createSubpage(event) {
  event.preventDefault();

  const pageName = subpageNameInput.value.trim();

  if (!pageName || !selectedContainerId) {
    return;
  }

  if (renamingPage) {
    project.renameContainer(selectedContainerId, pageName);

    saveWorkingProjectData(project.toObject());

    renderContainerTree(project.getContainerTree());

    selectContainer(selectedContainerId);

    closeAddSubpageDialog();

    return;
  }

  try {
    const newContainerId = project.createContainer({
      title: pageName,
      parentId: selectedContainerId,
      navigationImage: "",
    });

    saveWorkingProjectData(project.toObject());

    renderContainerTree(project.getContainerTree());
    selectContainer(newContainerId);

    closeAddSubpageDialog();
  } catch (error) {
    console.error("Subpage could not be created.", error);
    window.alert(error.message || "The subpage could not be created.");
  }
}

function openRenamePageDialog() {
  if (!selectedContainerId) {
    return;
  }

  renamingPage = true;

  const container = project.getContainer(selectedContainerId);

  document.getElementById("add-subpage-title").textContent = "Rename Page";
  subpageNameInput.value = container.title;

  addSubpageDialog.showModal();

  window.requestAnimationFrame(() => {
    subpageNameInput.select();
  });
}

async function deleteSelectedPage() {
  if (!selectedContainerId) {
    return;
  }

  const container = project.getContainer(selectedContainerId);

  if (!container) {
    return;
  }

  try {
    // Run the ProjectModel checks without deleting yet.
    if (selectedContainerId === project.startContainerId) {
      throw new Error("The Home page cannot be deleted.");
    }

    if (project.getChildIds(selectedContainerId).length > 0) {
      throw new Error("This page cannot be deleted because it has subpages.");
    }

    if (project.getLayout(selectedContainerId).length > 0) {
      throw new Error("This page cannot be deleted because it is not empty.");
    }

    const confirmed = await showTeacherConfirmation(
      `Delete page "${container.title}"?`,
      "Confirm Delete",
    );

    if (!confirmed) {
      return;
    }

    const parentId = project.deleteContainer(selectedContainerId);

    saveWorkingProjectData(project.toObject());

    renderContainerTree(project.getContainerTree());
    selectContainer(parentId);
  } catch (error) {
    console.error("Page could not be deleted.", error);

    showTeacherMessage(error.message || "The page could not be deleted.", "Unable to Delete Page");
  }
}

function openAddTileDialog() {
  tileNameInput.value = "";
  tileTypeSelect.value = "placeholder";
  tileThumbnailInput.value = "";
  tileThumbnailPreview.src = getDefaultTileImagePath();
  tileDestinationInput.value = "";

  updateTileDestinationField();

  addTileDialog.showModal();

  window.requestAnimationFrame(() => {
    tileNameInput.focus();
  });
}

function openAddSeparatorDialog() {
  if (!selectedContainerId) {
    showTeacherMessage("Select a page before adding a separator.");
    return;
  }

  separatorNameInput.value = "";
  addSeparatorDialog.showModal();

  window.requestAnimationFrame(() => {
    separatorNameInput.focus();
  });
}

function closeAddSeparatorDialog() {
  separatorNameInput.value = "";

  if (addSeparatorDialog.open) {
    addSeparatorDialog.close();
  }
}

function createSeparator(event) {
  event.preventDefault();

  if (!selectedContainerId) {
    showTeacherMessage("Select a page before adding a separator.");
    return;
  }

  const label = separatorNameInput.value.trim();

  if (!label) {
    showTeacherMessage("Enter a name for the separator.");
    separatorNameInput.focus();
    return;
  }

  const separator = {
    id: createSeparatorId(),
    type: "section",
    label,
    active: true,
  };

  const newLayoutIndex = project.addLayoutEntry(
    selectedContainerId,
    separator,
    selectedLayoutIndex,
  );

  saveWorkingProjectData(project.toObject());

  showSelectedContainer(selectedContainerId);
  selectLayoutEntry(newLayoutIndex);

  closeAddSeparatorDialog();
}

function createSeparatorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `section-${crypto.randomUUID()}`;
  }

  return `section-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTile(event) {
  event.preventDefault();

  if (!selectedContainerId) {
    showTeacherMessage("Select a page before adding a tile.");
    return;
  }

  const label = tileNameInput.value.trim();
  const type = tileTypeSelect.value;
  const image = tileThumbnailInput.value.trim();
  const target = type === "placeholder" ? "" : tileDestinationInput.value.trim();

  if (!label) {
    showTeacherMessage("Enter a name for the tile.");
    tileNameInput.focus();
    return;
  }

  if (type !== "placeholder" && !target) {
    showTeacherMessage("Enter a destination for the tile.");
    tileDestinationInput.focus();
    return;
  }

  const tile = {
    id: createTileId(),
    type,
    label,
    image,
    target,
    active: true,
  };

  const newLayoutIndex = project.addLayoutEntry(selectedContainerId, tile, selectedLayoutIndex);

  saveWorkingProjectData(project.toObject());

  selectedLayoutIndex = newLayoutIndex;

  showSelectedContainer(selectedContainerId);
  selectLayoutEntry(newLayoutIndex);

  closeAddTileDialog();
}

function createTileId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `tile-${crypto.randomUUID()}`;
  }

  return `tile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function closeAddTileDialog() {
  if (addTileDialog.open) {
    addTileDialog.close();
  }
}

function openImagePickerDialog() {
  selectedImagePath = tileThumbnailInput.value || null;
  imageSearchInput.value = "";

  renderImagePickerList();

  if (selectedImagePath) {
    updateImagePickerSelection(selectedImagePath);
  } else {
    imagePickerPreview.src = getDefaultTileImagePath();
    imagePickerFileName.textContent = "No image selected";
    selectImageButton.disabled = true;
  }

  imagePickerDialog.showModal();

  window.requestAnimationFrame(() => {
    imageSearchInput.focus();
  });
}

function renderImagePickerList() {
  imagePickerList.replaceChildren();

  const catalog = Array.isArray(window.CLASSROOM_IMAGES) ? window.CLASSROOM_IMAGES : [];

  const searchText = imageSearchInput.value.trim().toLowerCase();

  const filteredImages = catalog.filter((imagePath) => {
    const fileName = getImageFileName(imagePath).toLowerCase();

    return fileName.includes(searchText);
  });

  if (filteredImages.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "image-picker-empty";
    emptyMessage.textContent = "No matching images found.";

    imagePickerList.appendChild(emptyMessage);
    return;
  }

  filteredImages.forEach((imagePath) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "image-picker-list-item";
    button.dataset.imagePath = imagePath;
    button.textContent = getImageFileName(imagePath);

    if (imagePath === selectedImagePath) {
      button.classList.add("image-picker-list-item-selected");
    }

    button.addEventListener("click", () => {
      updateImagePickerSelection(imagePath);
    });

    button.addEventListener("dblclick", () => {
      updateImagePickerSelection(imagePath);
      applySelectedImage();
    });

    imagePickerList.appendChild(button);
  });
}

function updateImagePickerSelection(imagePath) {
  selectedImagePath = imagePath;

  imagePickerPreview.src = getImagePath(imagePath);
  imagePickerFileName.textContent = getImageFileName(imagePath);
  selectImageButton.disabled = false;

  imagePickerList.querySelectorAll(".image-picker-list-item-selected").forEach((item) => {
    item.classList.remove("image-picker-list-item-selected");
  });

  const selectedItem = imagePickerList.querySelector(
    `[data-image-path="${CSS.escape(imagePath)}"]`,
  );

  selectedItem?.classList.add("image-picker-list-item-selected");
}

function getImageFileName(imagePath) {
  return imagePath.split("/").pop() || imagePath;
}

function closeImagePickerDialog() {
  selectedImagePath = null;

  if (imagePickerDialog.open) {
    imagePickerDialog.close();
  }
}

function renderPdfPickerList() {
  pdfPickerList.replaceChildren();

  const catalog = Array.isArray(window.CLASSROOM_PDFS) ? window.CLASSROOM_PDFS : [];

  const searchText = pdfSearchInput.value.trim().toLowerCase();

  const filteredPdfs = catalog.filter((fileName) => fileName.toLowerCase().includes(searchText));

  if (filteredPdfs.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "pdf-picker-empty";
    emptyMessage.textContent = "No matching PDF files found.";

    pdfPickerList.appendChild(emptyMessage);
    return;
  }

  filteredPdfs.forEach((fileName) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "pdf-picker-list-item";
    button.dataset.pdfFileName = fileName;
    button.textContent = fileName;

    if (fileName === selectedPdf) {
      button.classList.add("pdf-picker-list-item-selected");
    }

    button.addEventListener("click", () => {
      updatePdfPickerSelection(fileName);
    });

    button.addEventListener("dblclick", () => {
      updatePdfPickerSelection(fileName);
      applySelectedPdf();
    });

    pdfPickerList.appendChild(button);
  });
}

function updatePdfPickerSelection(fileName) {
  selectedPdf = fileName;

  selectPdfButton.disabled = false;

  pdfPickerList.querySelectorAll(".pdf-picker-list-item-selected").forEach((item) => {
    item.classList.remove("pdf-picker-list-item-selected");
  });

  const selectedItem = pdfPickerList.querySelector(
    `[data-pdf-file-name="${CSS.escape(fileName)}"]`,
  );

  selectedItem?.classList.add("pdf-picker-list-item-selected");
}

function closePdfPickerDialog() {
  selectedPdf = null;

  if (pdfPickerDialog.open) {
    pdfPickerDialog.close();
  }
}

function openPdfPickerDialog() {
  selectedPdf = tileDestinationInput.value || null;
  pdfSearchInput.value = "";

  renderPdfPickerList();

  if (selectedPdf) {
    updatePdfPickerSelection(selectedPdf);
  } else {
    selectPdfButton.disabled = true;
  }

  pdfPickerDialog.showModal();

  window.requestAnimationFrame(() => {
    pdfSearchInput.focus();
  });
}

function applySelectedPdf() {
  if (!selectedPdf) {
    return;
  }

  tileDestinationInput.value = selectedPdf;

  closePdfPickerDialog();
}

function applySelectedImage() {
  if (!selectedImagePath) {
    return;
  }

  tileThumbnailInput.value = selectedImagePath;
  tileThumbnailPreview.src = getImagePath(selectedImagePath);

  closeImagePickerDialog();
}

async function deleteSelectedItem() {
  if (selectedContainerId === null || selectedLayoutIndex === null) {
    showTeacherMessage("Select a separator or tile to delete.");

    return;
  }

  const layout = project.getLayout(selectedContainerId);
  const entry = layout[selectedLayoutIndex];

  if (!entry) {
    showTeacherMessage("The selected item could not be found.");

    return;
  }

  const confirmed = await showTeacherConfirmation(
    `Delete "${getLayoutName(entry)}"?`,
    "Confirm Delete",
  );

  if (!confirmed) {
    return;
  }

  const deletedIndex = selectedLayoutIndex;

  project.deleteLayoutEntry(selectedContainerId, deletedIndex);

  saveWorkingProjectData(project.toObject());

  const updatedLayout = project.getLayout(selectedContainerId);

  showSelectedContainer(selectedContainerId);

  if (updatedLayout.length === 0) {
    return;
  }

  const nextSelectedIndex = Math.min(deletedIndex, updatedLayout.length - 1);

  selectLayoutEntry(nextSelectedIndex);
}

function updateTileDestinationField() {
  const type = tileTypeSelect.value;

  if (type === "placeholder") {
    tileDestinationGroup.hidden = true;
    tileDestinationInput.required = false;
    return;
  }

  tileDestinationGroup.hidden = false;
  tileDestinationInput.required = true;
  const usesLocalPicker = type === "pdf";
  tileDestinationInput.readOnly = usesLocalPicker;
  tileDestinationInput.placeholder = usesLocalPicker ? "Click to choose a PDF" : "";

  const labels = {
    video: "YouTube URL:",
    website: "Website URL:",
    pdf: "PDF File or URL:",
    powerpoint: "PowerPoint File or URL:",
    image: "Image File or URL:",
    information: "Text:",
  };

  tileDestinationLabel.textContent = labels[type] || "Destination:";
}

function moveSelectedItem(direction) {
  if (selectedContainerId === null || selectedLayoutIndex === null) {
    showTeacherMessage("Select a separator, tile, or navigation item to move.");

    return;
  }

  const layout = project.getLayout(selectedContainerId);
  const destinationIndex = selectedLayoutIndex + direction;

  if (destinationIndex < 0 || destinationIndex >= layout.length) {
    return;
  }

  const result = project.moveLayoutEntry(
    selectedContainerId,
    selectedLayoutIndex,
    destinationIndex,
  );

  saveWorkingProjectData(project.toObject());

  showSelectedContainer(selectedContainerId);
  selectLayoutEntry(result.newIndex);

  if (result.treeChanged) {
    renderContainerTree(project.getContainerTree());

    const selectedRow = containerTreeElement.querySelector(
      `[data-container-id="${CSS.escape(selectedContainerId)}"]`,
    );

    selectedRow?.classList.add("container-tree-row-selected");
  }
}

function showTeacherMessage(message, title = "Message") {
  messageDialogTitle.textContent = title;
  messageDialogText.textContent = message;

  messageDialogCancelButton.hidden = true;
  messageDialogOkButton.textContent = "OK";

  messageDialog.showModal();
}

function showTeacherConfirmation(message, title = "Confirm") {
  return new Promise((resolve) => {
    messageDialogTitle.textContent = title;
    messageDialogText.textContent = message;

    messageDialogCancelButton.hidden = false;
    messageDialogCancelButton.textContent = "Do Not Delete";
    messageDialogOkButton.textContent = "Delete";

    function finish(result) {
      messageDialogOkButton.removeEventListener("click", confirmDelete);
      messageDialogCancelButton.removeEventListener("click", cancelDelete);

      if (messageDialog.open) {
        messageDialog.close();
      }

      resolve(result);
    }

    function confirmDelete() {
      finish(true);
    }

    function cancelDelete() {
      finish(false);
    }

    messageDialogOkButton.addEventListener("click", confirmDelete);
    messageDialogCancelButton.addEventListener("click", cancelDelete);

    messageDialog.showModal();
  });
}

function createDataFileContents(projectData) {
  return `"use strict";

window.CLASSROOM_SITE = ${JSON.stringify(projectData, null, 2)};
`;
}

async function getAssetsFolder() {
  if (assetsFolderHandle) {
    return assetsFolderHandle;
  }

  if (!window.showDirectoryPicker) {
    throw new Error("Folder access is not supported. Use Chrome or Edge to run Teacher Mode.");
  }

  assetsFolderHandle = await window.showDirectoryPicker({
    mode: "readwrite",
  });

  if (assetsFolderHandle.name !== "assets") {
    assetsFolderHandle = null;
    throw new Error('Please select the folder named "assets".');
  }

  return assetsFolderHandle;
}

async function listAssets(folderHandle, indent = "") {
  for await (const entry of folderHandle.values()) {
    if (entry.kind === "directory") {
      console.log(`${indent}${entry.name}/`);
      await listAssets(entry, `${indent}    `);
    } else {
      console.log(`${indent}${entry.name}`);
    }
  }
}

async function buildAssetCatalogs(assetsFolder) {
  const catalogs = {};

  for await (const folder of assetsFolder.values()) {
    if (folder.kind !== "directory") {
      continue;
    }

    if (folder.name === "data" || folder.name.startsWith(".")) {
      continue;
    }

    catalogs[folder.name] = [];

    for await (const entry of folder.values()) {
      if (entry.kind !== "file") {
        continue;
      }

      if (entry.name === "catalog.js") {
        continue;
      }

      catalogs[folder.name].push(entry.name);
    }

    catalogs[folder.name].sort((a, b) => a.localeCompare(b));
  }

  return catalogs;
}

function createCatalogFileContents(folderName, filenames) {
  const globalName = `CLASSROOM_${folderName.toUpperCase()}`;

  return `"use strict";

window.${globalName} = ${JSON.stringify(filenames, null, 2)};
`;
}

async function writeCatalogFiles(assetsFolder, catalogs) {
  for (const [folderName, filenames] of Object.entries(catalogs)) {
    const folderHandle = await assetsFolder.getDirectoryHandle(folderName);

    const catalogFileHandle = await folderHandle.getFileHandle("catalog.js", {
      create: true,
    });

    const writable = await catalogFileHandle.createWritable();

    await writable.write(createCatalogFileContents(folderName, filenames));

    await writable.close();
  }
}

async function catalogAssets() {
  const assetsFolder = await getAssetsFolder();
  const catalogs = await buildAssetCatalogs(assetsFolder);

  await writeCatalogFiles(assetsFolder, catalogs);

  return assetsFolder;
}

async function writeDataFile(assetsFolder, projectData) {
  const dataFolder = await assetsFolder.getDirectoryHandle("data", {
    create: true,
  });

  const dataFileHandle = await dataFolder.getFileHandle("data.js", {
    create: true,
  });

  const writable = await dataFileHandle.createWritable();

  await writable.write(createDataFileContents(projectData));
  await writable.close();
}

/* =========================================================
   Event Listeners
   ========================================================= */

previewButton.addEventListener("click", () => {
  saveWorkingProjectData(project.toObject());
  window.location.href = "student.html?preview=true";
});
addSubpageButton.addEventListener("click", openAddSubpageDialog);
addSubpageForm.addEventListener("submit", createSubpage);
cancelAddSubpageButton.addEventListener("click", closeAddSubpageDialog);
addSubpageDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeAddSubpageDialog();
});
deletePageButton.addEventListener("click", deleteSelectedPage);
messageDialogOkButton.addEventListener("click", () => {
  if (!messageDialogCancelButton.hidden) {
    return;
  }

  messageDialog.close();
});
addTileButton.addEventListener("click", openAddTileDialog);
tileTypeSelect.addEventListener("change", updateTileDestinationField);
addSeparatorButton.addEventListener("click", openAddSeparatorDialog);
addSeparatorForm.addEventListener("submit", createSeparator);
cancelAddSeparatorButton.addEventListener("click", closeAddSeparatorDialog);
addSeparatorDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeAddSeparatorDialog();
});
cancelAddTileButton.addEventListener("click", closeAddTileDialog);
addTileDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeAddTileDialog();
});
addTileForm.addEventListener("submit", createTile);
deleteItemButton.addEventListener("click", deleteSelectedItem);
moveItemUpButton.addEventListener("click", () => {
  moveSelectedItem(-1);
});
moveItemDownButton.addEventListener("click", () => {
  moveSelectedItem(1);
});
changeTileThumbnailButton.addEventListener("click", openImagePickerDialog);
imageSearchInput.addEventListener("input", renderImagePickerList);
cancelImagePickerButton.addEventListener("click", closeImagePickerDialog);
imagePickerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applySelectedImage();
});
imagePickerDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeImagePickerDialog();
});
tileDestinationInput.addEventListener("click", () => {
  if (tileTypeSelect.value === "pdf") {
    openPdfPickerDialog();
  }
});
tileDestinationInput.addEventListener("keydown", (event) => {
  if (tileTypeSelect.value === "pdf" && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openPdfPickerDialog();
  }
});
pdfSearchInput.addEventListener("input", renderPdfPickerList);
cancelPdfPickerButton.addEventListener("click", closePdfPickerDialog);
pdfPickerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applySelectedPdf();
});
pdfPickerDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePdfPickerDialog();
});
publishButton.addEventListener("click", async () => {
  try {
    const assetsFolder = await catalogAssets();

    await writeDataFile(assetsFolder, project.toObject());

    console.log("Publish files updated.");
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error("Publish failed.", error);
  }
});
toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("active");

    window.setTimeout(() => {
      button.classList.remove("active");
    }, 1000);
  });
});
catalogAssetsButton.addEventListener("click", async () => {
  try {
    await catalogAssets();
    console.log("Asset catalogs updated.");
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error("Assets folder could not be selected.", error);
  }
});

void initializeTeacherView();
