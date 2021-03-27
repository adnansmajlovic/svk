<script>
  export let controlType = null;
  export let id;
  export let label;
  export let rows = null;
  export let value;
  export let type = "text";
  export let valid = true;
  export let disabled = false;
  export let readonly = false;
  export let validityMessage = "";
  export let autocomplete = "";

  let touched = false;
</script>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
    height: var(--height, 44px);
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: #f1faee;
    /* background: var(--body-background-color); */
    /* background: white; */
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }

  .invalid {
    border-color: red;
    background: #fde3e3;
  }

  .error-message {
    color: red;
    margin: 0.25rem 0;
  }

  input[readonly],
  input[disabled] {
    /* background: #ccc; */
    background: #abb5c4;
    color: #333;
    border: 1px groove slategrey;
    font-size: 1.45rem;
  }
</style>

<div class="form-control">
  <label for={id}>{label}</label>
  {#if controlType === 'textarea'}
    <textarea
      class:invalid={!valid && touched}
      {rows}
      {id}
      bind:value
      on:blur={() => (touched = true)} />
  {:else if controlType === 'search'}
    <input
      class:invalid={!valid && touched}
      {id}
      {type}
      {value}
      on:input
      on:search
      on:blur={() => (touched = true)} />
  {:else}
    <input
      class:invalid={!valid && touched}
      {type}
      {id}
      {value}
      {autocomplete}
      {disabled}
      {readonly}
      on:input
      on:keydown
      on:blur={() => (touched = true)} />
  {/if}
  {#if validityMessage && !valid && touched}
    <p class="error-message">{validityMessage}</p>
  {/if}
</div>
