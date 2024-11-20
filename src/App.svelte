<script>
  import { onMount } from 'svelte';
  import Main from './lib/main.svelte';
  import Footer from './lib/footer.svelte';

  onMount(() => {
    console.log("[INFO/STAT] Body has loaded.")
  });
</script>


<svelte:head>
  <meta name="keywords" content="Joey Manani, TheFlyingRat, Website, Blog">
</svelte:head>

<main>
  <Main />
</main>

<footer>
  <Footer />
</footer>