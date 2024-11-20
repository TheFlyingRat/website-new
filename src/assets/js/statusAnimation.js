import { gsap } from 'gsap';

// Function to create a typewriter effect
function typewriterEffect({ targetText, updateText, speed = 100 }) {
  let index = 0;
  var prevText = "";
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      prevText = prevText + targetText[index]
      updateText(prevText);
      //alert(targetText[index]);
      index++;
      if (index === targetText.length) {
        clearInterval(interval);
        resolve(); // Resolve the promise when done
      }
    }, speed);
  });
}

export function setupStatusAnimation({ setStatusText, setStatusDots, setConnectedText, setResolvedText, setResponseText, connectedTextTarget, resolvedTextTarget, responseTextTarget }) {
  let dotsInterval;
  let dots = "";

  const timeline = gsap.timeline();

  timeline.delay(0.4);

  // Typewriter animations
  timeline.call(async () => {
    await typewriterEffect({
      targetText: connectedTextTarget,
      updateText: setConnectedText,
      speed: 10,
    });
  });

  timeline.call(async () => {
    await typewriterEffect({
      targetText: resolvedTextTarget,
      updateText: setResolvedText,
      speed: 40,
    });
  });

  
  // Reveal lines sequentially
  timeline.set(".connected", { opacity: 1 });
  timeline.set(".resolved", { opacity: 1, delay: 0.2 });
  timeline.set(".response", { opacity: 1, delay: 0.2 });

  // Sequentially update the status text
  timeline.call(() => {
    setStatusText("Connecting...");
  }, null, "+=0");

  timeline.call(() => {
    setStatusText("Loading...");
  }, null, "+=0.2");

  timeline.call(() => {
    setResponseText("200 OK");
    setStatusText("Animating");
    startDotsAnimation();
  }, null, "+=0.4");

  timeline.call(() => {
    setStatusText("Wait user action");
  }, null, "+=4");

  function startDotsAnimation() {
    dotsInterval = setInterval(() => {
      dots = dots.length >= 3 ? "" : dots + ".";
      setStatusDots(dots); // Update status dots
    }, 500); // ..every 500ms
  }

  return () => {
    clearInterval(dotsInterval); // Cleanup dots animation
  };
}
