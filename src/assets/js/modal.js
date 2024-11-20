// modal.js
import { gsap } from "gsap";

// Function to show the modal
export function showModal(modal, background, text, setText) {
  gsap.set(modal, { scale: "0" });
  gsap.to(background, {
    backdropFilter: "blur(5px)",
    backgroundColor: "#000000aa",
  });
  gsap.to(modal, {
    scale: "1",
    duration: 0.4,
    ease: "power2.inOut",
  });

  // Update the modalText via a passed function (binding mechanism)
  setText(text);
}

export function hideModal(modal, background) {
  console.log("modal.js hideModal");
  gsap.to(background, {
    backdropFilter: "blur(0px)",
    backgroundColor: "#00000000",
  });
  gsap.to(modal, {
    scale: "0",
    duration: 0.4,
    ease: "power2.inOut",
  });
}