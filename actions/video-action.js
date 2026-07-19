"use strict";

let youtubePlayer = null;
let youtubeApiReadyPromise = null;
let currentElements = null;
let closeTimerId = null;

export function getYouTubeVideoId(target) {
  if (typeof target !== "string" || !target.trim()) {
    return null;
  }

  const value = target.trim();

  // Allow a plain YouTube video ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be") {
    return getValidVideoId(url.pathname.split("/").filter(Boolean)[0]);
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      return getValidVideoId(url.searchParams.get("v"));
    }

    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts[0] === "embed" || pathParts[0] === "shorts" || pathParts[0] === "live") {
      return getValidVideoId(pathParts[1]);
    }
  }

  return null;
}

function getValidVideoId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{11}$/.test(value) ? value : null;
}

export async function openVideo(entry, elements) {
  const videoId = getYouTubeVideoId(entry?.target);

  if (!videoId) {
    throw new Error("This tile does not contain a valid YouTube video.");
  }

  currentElements = elements;

  const { videoModal, videoTitle, youtubePlayerElement, closeVideoButton } = elements;

  videoTitle.textContent = entry.label || "Video";
  videoModal.hidden = false;

  await ensureYouTubeApiReady();

  youtubePlayer = new window.YT.Player(youtubePlayerElement, {
    videoId,
    playerVars: {
      autoplay: 1,
      rel: 0,
    },
    events: {
      onStateChange: handlePlayerStateChange,
    },
  });

  closeVideoButton.focus();
}

export function closeVideo(elements = currentElements) {
  if (closeTimerId) {
    window.clearTimeout(closeTimerId);
    closeTimerId = null;
  }
  if (youtubePlayer?.destroy) {
    youtubePlayer.destroy();
  }

  youtubePlayer = null;

  if (elements?.videoModal) {
    elements.videoModal.hidden = true;
  }

  currentElements = null;
}

function ensureYouTubeApiReady() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiReadyPromise) {
    return youtubeApiReadyPromise;
  }

  youtubeApiReadyPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === "function") {
        previousCallback();
      }

      resolve();
    };
  });

  return youtubeApiReadyPromise;
}

function handlePlayerStateChange(event) {
  if (event.data !== window.YT.PlayerState.ENDED) {
    return;
  }

  if (closeTimerId) {
    window.clearTimeout(closeTimerId);
  }

  closeTimerId = window.setTimeout(() => {
    closeTimerId = null;

    if (currentElements) {
      closeVideo(currentElements);
    }
  }, 100);
}
