<script>
  import { onMount } from 'svelte';
  import { initializeBackground } from '../assets/js/background.js'; 

  let background;

  onMount(() => {
    initializeBackground(background);
  });
</script>

<div class="background-wrapper">
  <div bind:this={background}></div>
</div>

<style lang="scss">
  @import "../assets/scss/background.scss";
</style>
