<script>
  import { onMount } from 'svelte';
  import { initializeBackground } from '../assets/js/background.js'; 

  let asciiArt = '';
  let background;
  let selector;

  // Load the ASCII art from the world.txt file
  onMount(async () => {
    try {
      const response = await fetch("/world.txt");
      if (!response.ok) {
        throw new Error('Failed to fetch ASCII art.');
      }
      asciiArt = await response.text();

      // Call the external script to initialize the background animation
      initializeBackground(asciiArt, background, selector);

    } catch (error) {
      console.error('Error loading ASCII art:', error);
    }
  });
</script>

<div class="background-wrapper">
  <div class="selector" bind:this={selector}>
    <img alt="Crosshair" width="20px" src="/crosshair.png">
  </div>
  <div bind:this={background}>
    {#if asciiArt}
      {asciiArt} 
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../assets/scss/background.scss";
</style>