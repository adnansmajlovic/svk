<script>
  import { onMount, onDestroy } from 'svelte';
  import amplifyStore from '../stores/amplify';
  import isAdminStore from '../stores/admin.js';
  import authUser from '../stores/auth.js';

  import { page, session } from '$app/stores';

  import User from '$lib/Auth/User.svelte';
  import { checkUser, signOut } from './Auth/aws';

  export let segment;

  let unsubscribe,
    unsubscribeAmplify,
    unsubscribeAPI,
    unsubscribeAuth,
    unsubscribeGraphqlOperation,
    unsubscribeStorage;

  let Amplify, Auth, API, graphqlOperation, Storage;

  let cognitoUser = null;
  let isAdmin = false;
  let isSuperAdmin = false;

  $: if (cognitoUser) {
    console.log('nav, yes cog user:', { cognitoUser });

    const groups =
      cognitoUser.signInUserSession.accessToken.payload['cognito:groups'];
    isAdmin = groups && !!groups.find((el) => el === 'Admin');
    isAdminStore.setIsAdmin(isAdmin);
  }

  $: ({ user } = $session);
  $: console.log('nav:', { user });
  $: console.log({ session });

  onMount(async () => {
    unsubscribe = authUser.subscribe((user) => {
      if (user) {
        cognitoUser = user;
      }
    });

    unsubscribeAmplify = amplifyStore.subscribe(async (amp) => {
      if (amp) {
        Amplify = amp;
        console.log({ Amplify });
      }
    });
    unsubscribeAPI = amplifyStore.subscribeAPI(async (amp) => {
      if (amp) {
        API = amp;
        console.log({ API });
      }
    });

    unsubscribeAuth = amplifyStore.subscribeAuth(async (amp) => {
      if (amp) {
        Auth = amp;
        console.log('insta auth', { Auth });
      }
    });

    unsubscribeGraphqlOperation = amplifyStore.subscribeGQL(async (gql) => {
      if (gql) {
        graphqlOperation = gql;

        console.log({ gql });
      }
    });

    unsubscribeStorage = amplifyStore.subscribeStorage(async (amp) => {
      if (amp) {
        Storage = amp;
      }
    });

    // if (!cognitoUser) {
    //   console.log('nav: !cognitoUser');
    //   const res = await checkUser();
    //   authUser.setauthUser(res);
    //   const groups =
    //     res.signInUserSession.accessToken.payload['cognito:groups'];
    //   isAdmin = groups && !!groups.find((el) => el === 'Admin');
    //   isAdminStore.setIsAdmin(isAdmin);

    //   // const res = checkUser();
    //   // if (res) {
    //   //   res.then((value) => {
    //   //     authUser.setauthUser(value);
    //   //     const groups =
    //   //       value.signInUserSession.accessToken.payload['cognito:groups'];
    //   //     isAdmin = groups && !!groups.find((el) => el === 'Admin');
    //   //     isAdminStore.setIsAdmin(isAdmin);
    //   //   });
    //   // }
    // } else {
    //   const groups =
    //     user.signInUserSession.accessToken.payload['cognito:groups'];
    //   isAdmin = groups && !!groups.find((el) => el === 'Admin');
    //   isAdminStore.setIsAdmin(isAdmin);
    // }
  });

  onDestroy(() => {
    // if (createAppListener) createAppListener.unsubscribe();
    // if (updateAppListener) updateAppListener.unsubscribe();
    // if (deleteAppListener) deleteAppListener.unsubscribe();

    // if (unsubscribe) unsubscribe();
    // if (unsubscribeAdmin) unsubscribeAdmin();

    if (unsubscribeAmplify) unsubscribeAmplify();
    if (unsubscribeAPI) unsubscribeAPI();
    if (unsubscribeAuth) unsubscribeAuth();
    if (unsubscribeGraphqlOperation) unsubscribeGraphqlOperation();
    if (unsubscribeStorage) unsubscribeStorage();
  });

  function handleSignOut() {
    cognitoUser = null;
    isAdmin = null;

    console.log('signout');

    signOut();
    authUser.setauthUser(null);
  }
</script>

<nav class="nav-dev">
  <ul>
    <li>
      <a aria-current={$page.path === '/' ? 'page' : undefined} href=".">
        home
      </a>
    </li>
    <li>
      <a
        aria-current={$page.path === '/about' ? 'page' : undefined}
        href="about"
      >
        about
      </a>
    </li>
    <li>
      <a aria-current={$page.path === '/two' ? 'page' : undefined} href="two">
        two
      </a>
    </li>
    <li>
      <a
        aria-current={$page.path === '/three' ? 'page' : undefined}
        href="three"
      >
        three
      </a>
    </li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <!-- <li>
      <a
        rel="prefetch"
        aria-current={segment === 'blog' ? 'page' : undefined}
        href="blog">
        blog
      </a>
    </li> -->

    <li style="float:right;">
      <User on:signOut={handleSignOut} />
    </li>
  </ul>
</nav>

{#if isAdmin}
  <div class="subnav">
    <ul>
      {#if isSuperAdmin}
        <li>
          <a
            aria-current={segment === 'cognito' ? 'page' : undefined}
            href="cognito"
          >
            cognito
          </a>
        </li>
      {/if}

      <li>
        <a aria-current={segment === 'lngs' ? 'page' : undefined} href="lngs">
          languages
        </a>
      </li>
      <li class="admin">Admin Panel</li>
    </ul>
  </div>
{/if}

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 400;
    padding: 0 1em;
    background-color: var(--nav-background-color-prod);
    color: var(--nav-color);
  }
  .nav-dev {
    background-color: var(--nav-background-color-dev);
  }

  .nav-test {
    background-color: var(--nav-background-color-test);
  }

  .nav-master {
    background-color: var(--nav-background-color-prod);
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  /* a.s. subnav */
  /* The subnavigation menu */
  .subnav {
    /* float: left;
    overflow: hidden; */
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
    background-color: var(--subnav-background-color);
    color: var(--subnav-color);
  }

  .admin {
    text-align: center;
    padding: 1em 0.5em;
    float: right;
    font-weight: 800;
    color: #e9c46a;
  }
</style>
