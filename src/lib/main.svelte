<script>
  import Title from "./title.svelte";
  import Status from "./status.svelte";
  import Content from "./content.svelte";
  import Background from "./background.svelte";
</script>

<svelte:head>
  <meta name="title" content="TheFlyingRat" />
  <meta name="description" content="I'm Joey. I create cool things on the Internet. This is my personal website." />
  <title>TheFlyingRat</title>
</svelte:head>

<div class="content-wrapper">

  <Title />
  <Status />
  <Content />
  <Background />

</div>


