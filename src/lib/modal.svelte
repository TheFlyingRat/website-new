<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { showModal, hideModal } from "../assets/js/modal.js";
  let background, modal;
  let modalText = "";

  const dispatch = createEventDispatcher();

  function closeModal() {
    hideModal(modal, background);
    dispatch("close"); // Dispatch the 'close' event to close modal
  }

  // Function to update the modalText
  function setModalText(newText) {
    modalText = newText;
  }

  onMount(() => {
    // Call showModal with the modal, background, and text content upon mount
    showModal(modal, background, null, setModalText);

    // close modal if escape is pressed
    window.addEventListener('keydown', (event) => {
      if (event.key === "Escape") {
        closeModal()
      }
    });
  });
</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this="{background}" on:click="{closeModal}" class="background"></div>
<div bind:this="{modal}" class="modal">
  <slot></slot>
</div>


<style lang="scss">
  @import "../assets/scss/modal.scss";
</style>