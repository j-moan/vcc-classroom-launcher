"use strict";

export function createTile({ label, image, onSelect }) {
  const tile = document.createElement("button");

  tile.type = "button";
  tile.className = "classroom-tile";
  tile.setAttribute("aria-label", label);

  const imageFrame = createImageFrame({
    image,
    label,
  });

  const labelElement = document.createElement("span");
  labelElement.className = "tile-label";
  labelElement.textContent = label;

  tile.append(imageFrame, labelElement);

  if (typeof onSelect === "function") {
    tile.addEventListener("click", onSelect);
  }

  return tile;
}

function createImageFrame({ image, label }) {
  const imageFrame = document.createElement("span");
  imageFrame.className = "tile-image-frame";

  if (!image) {
    return imageFrame;
  }

  const imageElement = document.createElement("img");

  imageElement.className = "tile-image tile-image-cover";
  imageElement.src = image;
  imageElement.alt = label;

  imageElement.addEventListener("error", () => {
    imageFrame.replaceChildren();

    const placeholder = document.createElement("span");
    placeholder.className = "tile-image-placeholder";
    placeholder.textContent = "No image";

    imageFrame.classList.add("tile-image-missing");
    imageFrame.appendChild(placeholder);
  });

  imageFrame.appendChild(imageElement);

  return imageFrame;
}
