"use strict";

import { renderLayout } from "./renderers/layout-renderer.js";
import { validateProject } from "./validators/project-validator.js";
import { validateAssets } from "./validators/asset-validator.js";
import { loadProject, ProjectLoadError } from "./project/project-loader.js";
import { openVideo, closeVideo } from "./actions/video-action.js";
import { openPdf, closePdf } from "./actions/pdf-action.js";

const TEACHER_PASSWORD = "class";
const DEFAULT_COLUMNS = 8;
const PASSWORD_ERROR_DURATION = 1000;

let project = null;
let currentContainerId = null;
let messageTimerId = null;
let passwordErrorTimerId = null;

const elements = {
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  pageSections: document.getElementById("pageSections"),

  homeButton: document.getElementById("homeButton"),
  backButton: document.getElementById("backButton"),
  teacherButton: document.getElementById("teacherButton"),

  teacherPasswordDialog: document.getElementById("teacherPasswordDialog"),
  teacherPasswordForm: document.getElementById("teacherPasswordForm"),
  teacherPasswordInput: document.getElementById("teacherPasswordInput"),
  teacherPasswordFeedback: document.getElementById("teacherPasswordFeedback"),
  cancelTeacherPasswordButton: document.getElementById("cancelTeacherPasswordButton"),

  videoModal: document.getElementById("videoModal"),
  videoTitle: document.getElementById("videoTitle"),
  youtubePlayerElement: document.getElementById("youtubePlayer"),
  closeVideoButton: document.getElementById("closeVideoButton"),

  pdfModal: document.getElementById("pdfModal"),
  pdfTitle: document.getElementById("pdfTitle"),
  pdfFrame: document.getElementById("pdfFrame"),
  closePdfButton: document.getElementById("closePdfButton"),

  messageBox: document.getElementById("messageBox"),
};

async function initialize() {
  try {
    project = await loadProject();
  } catch (error) {
    handleProjectLoadFailure(error);
    return;
  }

  const projectData = project.toObject();
  const projectValidation = validateProject(projectData);

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

  navigateToContainer(project.startContainerId);

  const assetValidation = await validateAssets(projectData);
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
  const isHome = currentContainerId === project.startContainerId;

  elements.teacherButton.hidden = !isHome;
  elements.homeButton.hidden = isHome;
  elements.backButton.hidden = isHome || !container.parent;
}

function navigateHome() {
  if (project?.startContainerId) {
    navigateToContainer(project.startContainerId);
  }
}

function navigateBack() {
  const currentContainer = getContainer(currentContainerId);

  if (currentContainer?.parent) {
    navigateToContainer(currentContainer.parent);
  }
}

/* =========================================================
   Teacher Mode authentication
   ========================================================= */

function openTeacherPasswordDialog() {
  clearPasswordErrorTimer();
  resetTeacherPasswordDialog();

  elements.teacherPasswordDialog.showModal();

  window.requestAnimationFrame(() => {
    elements.teacherPasswordInput.focus();
  });
}

function closeTeacherPasswordDialog() {
  clearPasswordErrorTimer();
  resetTeacherPasswordDialog();

  if (elements.teacherPasswordDialog.open) {
    elements.teacherPasswordDialog.close();
  }
}

function submitTeacherPassword(event) {
  event.preventDefault();

  const enteredPassword = elements.teacherPasswordInput.value.trim();

  const passwordMatches =
    enteredPassword.toLocaleLowerCase() === TEACHER_PASSWORD.toLocaleLowerCase();

  if (passwordMatches) {
    window.location.href = "teacher.html";
    return;
  }

  showIncorrectPassword();
}

function showIncorrectPassword() {
  clearPasswordErrorTimer();

  elements.teacherPasswordForm.classList.add("dialog-error");
  elements.teacherPasswordFeedback.hidden = false;
  elements.teacherPasswordInput.value = "";
  elements.teacherPasswordInput.disabled = true;

  passwordErrorTimerId = window.setTimeout(() => {
    passwordErrorTimerId = null;

    resetTeacherPasswordDialog();

    if (elements.teacherPasswordDialog.open) {
      elements.teacherPasswordDialog.close();
    }

    navigateHome();
  }, PASSWORD_ERROR_DURATION);
}

function resetTeacherPasswordDialog() {
  elements.teacherPasswordForm.classList.remove("dialog-error");
  elements.teacherPasswordFeedback.hidden = true;
  elements.teacherPasswordInput.disabled = false;
  elements.teacherPasswordInput.value = "";
}

function clearPasswordErrorTimer() {
  if (!passwordErrorTimerId) {
    return;
  }

  window.clearTimeout(passwordErrorTimerId);
  passwordErrorTimerId = null;
}

/* =========================================================
   Content actions
   ========================================================= */

function handleContentAction(entry) {
  switch (entry.type) {
    case "video":
      openVideo(entry, elements).catch((error) => {
        showMessage(error.message);
      });
      break;
    case "information":
      break;
    case "website":
    case "pdf":
      try {
        openPdf(entry, elements);
      } catch (error) {
        showMessage(error.message);
      }
      break;
    case "powerpoint":
    case "image":
      showMessage(`${getEntryLabel(entry)} selected.`);
      break;
    case "placeholder":
      break;
    default:
      showMessage(`Unsupported content type: ${entry.type}`);
  }
}

function getEntryLabel(entry) {
  return entry.label || entry.title || "Untitled";
}

function getContainer(containerId) {
  return project?.getContainer(containerId) || null;
}

function isContainerAccessible(containerId) {
  return project?.isContainerAccessible(containerId) || false;
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
elements.teacherButton.addEventListener("click", openTeacherPasswordDialog);
elements.teacherPasswordForm.addEventListener("submit", submitTeacherPassword);
elements.cancelTeacherPasswordButton.addEventListener("click", closeTeacherPasswordDialog);
elements.teacherPasswordDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeTeacherPasswordDialog();
});
elements.closeVideoButton.addEventListener("click", () => {
  closeVideo(elements);
});
elements.videoModal.addEventListener("click", (event) => {
  if (event.target === elements.videoModal) {
    closeVideo(elements);
  }
});
elements.closePdfButton.addEventListener("click", () => {
  closePdf(elements);
});

elements.pdfModal.addEventListener("click", (event) => {
  if (event.target === elements.pdfModal) {
    closePdf(elements);
  }
});

void initialize();
