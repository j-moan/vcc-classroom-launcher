"use strict";

import { loadProject } from "./project/project-loader.js";

const publishButton = document.querySelector("#publish-button");
const toolbarButtons = document.querySelectorAll(".teacher-tool-button");
const containerTreeElement = document.querySelector("#containerTree");

let project = null;

async function initializeTeacherView() {
  try {
    project = await loadProject();

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

  const marker = document.createElement("span");
  marker.className = "container-tree-marker";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = node.children.length > 0 ? "▼" : "•";

  const label = document.createElement("span");
  label.className = "container-tree-label";
  label.textContent = node.title || "Untitled Page";

  if (!node.active) {
    row.classList.add("container-tree-row-inactive");
    label.textContent += " (Inactive)";
  }

  row.append(marker, label);
  listItem.appendChild(row);

  if (node.children.length > 0) {
    const childList = document.createElement("ul");
    childList.className = "container-tree-list";

    node.children.forEach((childNode) => {
      childList.appendChild(createTreeNode(childNode));
    });

    listItem.appendChild(childList);
  }

  return listItem;
}

function showTreeMessage(message) {
  containerTreeElement.replaceChildren();

  const messageElement = document.createElement("p");
  messageElement.className = "teacher-tree-message";
  messageElement.textContent = message;

  containerTreeElement.appendChild(messageElement);
}

publishButton.addEventListener("click", () => {
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

void initializeTeacherView();
