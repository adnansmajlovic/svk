<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { SignIn } from '$lib/Auth/aws';
  import LoadingSpinner from '$lib/UI/LoadingSpinner.svelte';
  import authUser from '../stores/auth.js';
  import TextInput from '$lib/UI/TextInput.svelte';
  import Button from '$lib/UI/Button.svelte';
  import { isEmpty, isValidEmail } from '../helpers/validation.js';

  let email = '';
  let password = '';
  let isLoggingIn = false;
  let unsubscribe;
  let cognitoUser;

  $: emailValid = isValidEmail(email);
  $: formIsValid = emailValid;

  async function handleSignIn() {
    isLoggingIn = true;
    const res = await SignIn(email, password);
    authUser.setauthUser(res);
    isLoggingIn = false;
    goto('/');
  }

  onMount(() => {
    unsubscribe = authUser.subscribe((user) => {
      cognitoUser = user;
      console.log('signIn', { cognitoUser });
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<svelte:head>
  <title>Sign In</title>
</svelte:head>

<main>
  {#if isLoggingIn}
    <LoadingSpinner />
  {/if}

  <form on:submit|preventDefault={handleSignIn}>
    <TextInput
      id="email"
      label="E-Mail"
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid email address."
      value={email}
      on:input={(event) => (email = event.target.value)}
    />

    <TextInput
      id="Password"
      label="Password"
      type="password"
      value={password}
      on:input={(event) => (password = event.target.value)}
      autocomplete="on"
    />

    <Button type="submit" disabled={!formIsValid}>Sign In</Button>
  </form>
</main>

<style>
</style>
