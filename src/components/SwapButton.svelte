<script>
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let label = "Swap";
  
  const dispatch = createEventDispatcher();
  let isAnimating = false;

  function handleClick() {
    // trigger Animation
    isAnimating = true;
    setTimeout(() => isAnimating = false, 400); // reset after 400ms

    dispatch('click');
  }
</script>

<Button variant="secondary" on:click={handleClick} {...$$restProps}>
  <div class="content-wrapper">
    <span class="icon" class:spin={isAnimating}>⇅</span>
    <span>{label}</span>
  </div>
</Button>

<style>
  .content-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    display: inline-block;
    font-size: 1.1em;
    font-weight: bold;
    transition: transform 0.4s ease-in-out;
  }

  /* animation class */
  .spin {
    transform: rotate(180deg);
  }
</style>