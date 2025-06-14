export let lastHoveredColumn = 0;
export let lastHoveredIndex = 0;

export function updateColIdx(col, idx) {
  lastHoveredColumn = col;
  lastHoveredIndex = idx;
}

// Audio threads for simultaneous playback
export const audioThread1 = new Audio();
export const audioThread2 = new Audio();

// In-memory cache for the audio files
const audioCache = {};

// Preload the audio files into memory cache and create Blob URLs
async function preloadAudio(sound) {
  try {
    if (audioCache[sound]) {
      // Audio data already exists in cache
      return;
    }

    const base64Data = localStorage.getItem(sound);
    if (base64Data) {
      const blob = base64ToBlob(base64Data);
      audioCache[sound] = URL.createObjectURL(blob); // Create Blob URL
    } else {
      console.log(`Audio data for ${sound} not found in localStorage.`);
      await fetchAudioData(sound); // Fetch the missing audio data
    }
  } catch (error) {
    console.log("Error preloading audio: " + error);
  }
}

async function fetchAudioData(sound) {
  try {
    const response = await fetch("/" + sound + ".mp3");
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const reader = new FileReader();

    reader.onload = function () {
      const base64Data = reader.result;
      audioCache[sound] = URL.createObjectURL(blob); // Create Blob URL
      // @ts-ignore
      localStorage.setItem(sound, base64Data); // Store in localStorage
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.log("Error fetching audio data: " + error);
  }
}

// Helper function to convert base64 to Blob
function base64ToBlob(base64Data) {
  const parts = base64Data.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// Preload all the audio files
async function preloadAllSounds() {
  const sounds = ["select", "open", "close", "text"];
  await Promise.all(sounds.map(preloadAudio)); // Ensure all preloads are completed
}

// Play a sound from the in-memory cache
export async function playSound(sound) {
  try {
    // Ensure the requested sound is preloaded
    if (!audioCache[sound]) {
      await preloadAudio(sound);
    }

    if (audioCache[sound]) {
      const audioElement = audioThread1.paused ? audioThread1 : audioThread2;
      audioElement.src = audioCache[sound];

      if (sound === "open" || sound === "close") {audioElement.volume = 0.3}; // volume for open/close is too loud
      audioElement.addEventListener("ended", (e) => audioElement.volume = 1); //reset vol
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(function (error) {
          console.log("User didn't interact with the document!");
        });
      }
    } else {
      console.warn(`Audio data for ${sound} not found in cache.`);
    }
  } catch (error) {
    console.error("Couldn't play sound because of an error: " + error);
  }
}

// Only play sound if hovering over a different item
export function playSoundIf(col, idx, name) {
  if (col !== lastHoveredColumn || idx !== lastHoveredIndex) {
    console.log("[DEBUG] Playing sound since item hover different...")
    playSound(name);
    lastHoveredColumn = col; // Update last hovered column
    lastHoveredIndex = idx;  // Update last hovered index
  }
}

// Immediately preload all sounds when the module is imported
preloadAllSounds();
