import { gsap } from "gsap";
import { playSound, audioThread1, audioThread2 } from "./audioUtils";

export function setupTitleAnimation({ targetText, displayedText, titleContainer, setDisplayedText }) {
  const shuffleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // only shuffle a-z

  // Function to shuffle a character
  function getRandomChar() {
    return shuffleChars[Math.floor(Math.random() * shuffleChars.length)];
  }

  // Function to animate the title text
  function animateTitle() {
    const timeline2 = gsap.timeline({
      onComplete: () => {
        audioThread1.pause();
        audioThread2.pause();
        audioThread1.currentTime = 0;
        audioThread2.currentTime = 0;
        moveToTop();
      }
    });
    timeline2.delay(1.2);
    let currentText = displayedText.split("");

    timeline2.call(playSound, ["text"], 0);

    for (let i = 0; i < targetText.length; i++) {
      // Add shuffle animations for all characters
      timeline2.to(
        {},
        {
          duration: 0.2, // Each character resolves after 0.2s
          onUpdate: () => {
            for (let j = i; j < targetText.length; j++) {
              if (j > i) currentText[j] = getRandomChar(); // Shuffle unresolved characters
            }
            currentText[i] = targetText[i]; // Set the resolved character
            setDisplayedText(currentText.join(""));
          },
        },
        i * 0.2 // Stagger each letter by 0.2 seconds
      );
    }
  }

  // Function to move the title to the top
  function moveToTop() {
    const timeline = gsap.timeline();

    // Move left bracket off screen
    timeline.to(".break-left", {
      x: "-100vw",
      ease: "power2.in",
      duration: 0.6,
    });

    // Move right bracket off screen
    timeline.to(
      ".break-right",
      {
        x: "100vw",
        ease: "power2.in",
        duration: 0.6,
      },
      "<"
    );

    // Fixed issue #1 by predicting what the destination size SHOULD be
    timeline.to(titleContainer, {
      fontSize: window.screen.width < 650 ? "36px" : "5vw",
      duration: 1,
      top: 0,
      ease: "power2.out",
      delay: 0.3,
    });

    // After the animation, ensure the title resizes naturally
    timeline.set(titleContainer, { fontSize: "max(5vw, 36px)" });
    timeline.set([".break-left", ".break-right"], { display: "none" }); // Hide brackets
    timeline.set("body", { overflowY: "scroll" });
    timeline.to(".reveal", { opacity: "100%", pointerEvents: "initial" });
  }

  // Return the function to start the animation
  return animateTitle;
}
