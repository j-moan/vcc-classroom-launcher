const DEFAULT_TILE_IMAGE_PATH = "resources/default-tile.jpg";
const DEFAULT_HEADER_IMAGE_PATH = "resources/default-header.jpg";

export function getDefaultTileImagePath() {
  return DEFAULT_TILE_IMAGE_PATH;
}

export function getDefaultHeaderImagePath() {
  return DEFAULT_HEADER_IMAGE_PATH;
}

export function getImagePath(filename) {
  return `assets/images/${filename}`;
}

export function getPdfPath(filename) {
  return `assets/pdfs/${filename}`;
}

export function getVideoPath(filename) {
  return `assets/videos/${filename}`;
}

export function getPowerPointPath(filename) {
  return `assets/powerpoints/${filename}`;
}
