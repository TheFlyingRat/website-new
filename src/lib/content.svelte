<script>
  import { titles, columns, handleKeydown, handleMouseOver, handleClick } from '../assets/js/menuHandler.js';
  import { updateColIdx, playSound, playSoundIf } from '../assets/js/audioUtils.js';
  import { onMount } from 'svelte';
  import Modal from '../lib/modal.svelte';

  let currentColumn = 0; 
  let selectedIndex = 0;
  let isModalVisible = false;
  let modalContent = ""; 

  // Function to show the modal
  function showModal(content) {
    isModalVisible == false ? playSound("open") : null; // don't play audio if modal open
    modalContent = content;
    isModalVisible = true;
  }

  // Function to hide the modal
  function hideModal() {
    isModalVisible == true ? playSound("close") : null;
    setTimeout(() => {isModalVisible = false}, 400); // wait for animation
  }

  function keyEvent(event) {
    const result = handleKeydown(event, currentColumn, selectedIndex, showModal);
      currentColumn = result.currentColumn;
      selectedIndex = result.selectedIndex;

      updateColIdx(currentColumn, selectedIndex)
  }

  // Listen for keyboard events
  onMount(() => {
    setTimeout(() => {window.addEventListener('keydown', keyEvent)}, 5500);
    // wait for title animation

    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  });

  // Wrapper for handleClick to include modal logic
  function handleClickWithModal(item) {
    handleClick(item, showModal);
  }
</script>

{#if isModalVisible}
  <Modal on:close={hideModal}>
    {@html modalContent}
  </Modal>
{/if}

<div class="content reveal">
  {#each columns as column, colIndex}
    <div class="hacker-border">
      <h2 class="subtitle">{titles[colIndex]}</h2>
      <div>
        {#each column as item, index}
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <p 
            class:selected={currentColumn === colIndex && selectedIndex === index}
            on:mouseover={() => {playSoundIf(colIndex, index, "select"); [currentColumn, selectedIndex] = handleMouseOver(colIndex, index, currentColumn, selectedIndex)}}
            on:click={() => handleClickWithModal(item)}
          >
            {item}
          </p>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @import "../assets/scss/content.scss";
</style>
