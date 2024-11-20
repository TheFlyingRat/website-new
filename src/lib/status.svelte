<script>
  import { onMount } from 'svelte';
  import { setupStatusAnimation } from '../assets/js/statusAnimation.js';
  import { myIP, myZone } from '../assets/js/_variables.js';

  // Declare reactive state vars
  let connectedTextTarget = `${myIP}`;
  let resolvedTextTarget = `${myZone}`;
  let responseTextTarget = "200 OK";
  let connectedText = "";
  let resolvedText = "";
  let responseText = "";
  let statusText = "";
  let statusDots = "";

  // Hook
  onMount(() => {
    // Start the status animation
    const cleanup = setupStatusAnimation({
      setConnectedText: (text) => (connectedText = text),
      setResolvedText: (text) => (resolvedText = text),
      setStatusText: (text) => (statusText = text),
      setResponseText: (text) => (responseText = text),
      setStatusDots: (updateDots) => (statusDots = updateDots),
      connectedTextTarget,
      resolvedTextTarget,
      responseTextTarget,
    });

    return cleanup; // Cleanup interval when component is destroyed
  });
</script>


<div class="status-wrapper" style="position: absolute">
  <p class="status">Status: {statusText}<span>{statusDots}</span></p>
  <p class="connected" style="opacity: 0;">Connected to: {connectedText}</p>
  <p class="resolved" style="opacity: 0;">Resolved: {resolvedText}</p>
  <p class="response" style="opacity: 0;">Response: {responseText}</p>
  <br>
</div>

<style lang="scss">
  @import "../assets/scss/status.scss";
</style>