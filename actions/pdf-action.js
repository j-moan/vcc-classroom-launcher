"use strict";

let currentElements = null;

export function openPdf(entry, elements) {
  const target = getPdfTarget(entry);

  if (!target) {
    throw new Error("This tile does not contain a valid PDF file.");
  }

  currentElements = elements;

  const { pdfModal, pdfTitle, pdfFrame, closePdfButton } = elements;

  pdfTitle.textContent = entry.label || "PDF";
  pdfFrame.src = target;
  pdfModal.hidden = false;

  closePdfButton.focus();
}

export function closePdf(elements = currentElements) {
  if (!elements) {
    return;
  }

  elements.pdfFrame.src = "about:blank";
  elements.pdfModal.hidden = true;

  currentElements = null;
}

function getPdfTarget(entry) {
  if (typeof entry?.target !== "string" || !entry.target.trim()) {
    return null;
  }

  return entry.target.trim();
}
