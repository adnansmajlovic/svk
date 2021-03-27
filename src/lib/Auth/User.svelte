<script>
  import { goto } from '$app/navigation';
  import { getStores, navigating, page, session } from '$app/stores';
  // import * as api from '$lib/api.js';

  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import authUser from '../../stores/auth.js';
  import Button from '$lib/UI/Button.svelte';
  import LoadingSpinner from '$lib/UI/LoadingSpinner.svelte';

  const dispatch = createEventDispatcher();
  let unsubscribe;
  let loaded = false;
  let cognitoUser;

  $: signedIn = cognitoUser;

  onMount(() => {
    unsubscribe = authUser.subscribe((user) => {
      if (user) {
        cognitoUser = user;
      }
      loaded = true;
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  async function signOut() {
    console.log('signOut Authenticate.svelte');

    cognitoUser = null;
    dispatch('signOut');

    goto('/');
  }
</script>

{#await cognitoUser}
  <!-- promise is pending -->
  <LoadingSpinner />
{:then value}
  <div id="user-controls">
    <!-- promise was fulfilled -->
    {#if cognitoUser && typeof value !== 'undefined' && value !== null && loaded}
      {$session.user.email}
      <Button on:click={signOut} mode="outline">Sign Out</Button>
      <!-- <div transition:fade={{ duration: 1000 }}>
      </div> -->
    {:else if loaded && (typeof value === 'undefined' || value === null)}
      <Button on:click={() => goto('/signin')}>Sign In</Button>
      <Button on:click={() => goto('/signup')}>Sign Up</Button>
    {/if}
  </div>
  <!-- <div transition:fade={{ duration: 2000 }}>
  </div> -->
{/await}

<!-- {cognitoUser.attributes.email} -->

<!-- {#if loaded}
  <div transition:fade={{ duration: 2000 }}>
    {#if signedIn}
      <Button on:click={signOut}>Sign Out</Button>
    {:else}
      <Button on:click={() => goto('/signin')}>Sign In</Button>

      <Button on:click={() => goto('/signup')}>Sign Up</Button>
    {/if}
  </div>
{/if} -->
<style>
  #user-controls {
    margin-top: 0.3rem;
    /* display: flex; */
    /* justify-content: space-between; */
    /* margin-left: auto;
    margin-right: 1rem; */
    /* float: right; */
  }
</style>
