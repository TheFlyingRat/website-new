import { gsap } from 'gsap';
import { random } from 'gsap/gsap-core';

export function initializeBackground(asciiArt, background, selector) {
  let skewParamX, skewParamY;
  const ratio = 3;

  // Function to generate skews based on ratio
  function generateSkews() {
    skewParamX = random(-30, 30);
    skewParamY = skewParamX / ratio;
  }

  function animateBackground() {
    const resetDuration = 5;
    const transformOriginDuration = 0;
    const animationDuration = 5;
    var flag = false;

    function applyAnimation() {
      generateSkews();

      // Step 1: Reset to flat state
      gsap.to([background, selector], {
        skewX: "0deg",
        skewY: "0deg",
        scale: 1,
        opacity: 0.1,
        duration: flag == true ? resetDuration : 0,
        ease: "power2.out",
        onComplete: () => {
          flag = true;
          // 15-85 because of oceans
          let x = random(15, 85);
          let y = random(15, 85);

          // Step 2: Smoothly transition to new transformOrigin
          gsap.to([background, selector], {
            transformOrigin: `${x}% ${y}%`,
            duration: transformOriginDuration,
            ease: "power1.inOut",
            onComplete: () => {
              // Step 3: Move crosshair to the pixel location of the transform origin
              const backgroundRect = background.getBoundingClientRect();

              // Convert percentage to pixels based on background size
              const pxX = (x / 100) * backgroundRect.width * 1;
              const pxY = (y / 100) * backgroundRect.height * 1;

              // Move the crosshair to the calculated pixel values
              gsap.to(selector, {
                x: pxX,
                y: pxY,
                duration: 0.5,
                ease: "power2.out"
              });
              // Step 4: Apply skew and scaling to bg and crosshair
              gsap.to([background, selector], {
                skewX: `${skewParamX}deg`,
                skewY: `${skewParamY}deg`,
                scale: random(1.5, 2.4),
                opacity: 0.2,
                duration: animationDuration,
                ease: "power3.inOut",
                onComplete: applyAnimation, // Recursive call for infinite loop
              });
            },
          });
        },
      });
    }

    applyAnimation(); // Start the animation loop
  }

  animateBackground();
}
