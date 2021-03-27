<script context="module">
  export async function load({ page, fetch, session, context }) {
    const user = session.user;
    return { user };
  }
</script>

<script>
  import { getStores, navigating, page, session } from '$app/stores';
  export let user;
  $: ({ user } = $session);
  $: console.log('two:', { user });
</script>

two
