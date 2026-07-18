"use strict";

export function renderSectionEntry(entry) {
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
