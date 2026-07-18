"use strict";

import { loadProject } from "./project/project-loader.js";
import { ProjectModel } from "./models/project-model.js";
import {
  loadWorkingProjectData,
  saveWorkingProjectData,
  publishProject,
} from "./project/project-storage.js";

const publishButton = document.querySelector("#publish-button");
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

let project = null;
let selectedContainerId = null;
let selectedLayoutIndex = null;
let renamingPage = false;

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

  const imagePath = entry.image || "images/default-page.jpg";

  const image = document.createElement("img");
  image.className = "teacher-layout-thumbnail";
  image.src = imagePath;
  image.alt = "";

  image.addEventListener("error", () => {
    image.src = "images/default-page.jpg";
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

  return entry.label || entry.title || "Untitled Item";
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

publishButton.addEventListener("click", () => {
  publishProject(project.toObject());
  window.location.href = "student.html";
});

toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("active");

    window.setTimeout(() => {
      button.classList.remove("active");
    }, 1000);
  });
});

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
      navigationImage: "images/default-page.jpg",
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

void initializeTeacherView();
