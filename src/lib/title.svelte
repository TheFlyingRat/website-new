<script>
  import { onMount } from "svelte";
  import { setupTitleAnimation } from "../assets/js/titleAnimation.js";

  let displayedText = "############"; // Initial text with random placeholders
  const targetText = "THEFLYINGRAT"; // Final text to display
  let titleContainer; // Reference to the title container

  onMount(() => {
    const animateTitle = setupTitleAnimation({
      targetText,
      displayedText,
      titleContainer,
      setDisplayedText: (text) => (displayedText = text),
    });

    animateTitle(); // Start the title animation
  });
</script>

<div class="title" bind:this={titleContainer}>
  <div class="title-text">
    <div class="break-left">[</div><div>{displayedText}</div><div class="break-right">]</div>
  </div>
</div>

<style lang="scss">
  @import "../assets/scss/title.scss";
</style>