<script context="module">
	/**
	 * @param {import('@sveltejs/kit).LoadOptions} options
	 * @returns {import('@sveltejs/kit').Loaded}
	 */
	export async function load({ page, fetch, session, context }) {
		// const url = `/blog/${page.params.slug}.json`;
		// const res = await fetch(url);

		// if (res.ok) {
		//   return {
		//     props: {
		//       article: await res.json(),
		//     },
		//   };
		// }

		return {
			// status: res.status,
			// error: new Error(`Could not load ${url}`),
		};
	}
</script>

<script>
	/**
	 * `amp` is `true` or `false` depending on the corresponding
	 * value in your [project configuration](#configuration)
	 * `browser` is `true` or `false` depending on whether the app
	 * is running in the browser or on the server
	 * `dev` is `true` in development mode, `false` in production
	 */

	import { amp, browser, dev } from '$app/env';
	import { goto } from '$app/navigation';
	import { getStores, navigating, page, session } from '$app/stores';
	import { onMount, onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Nav from '$lib/Nav.svelte';
	import awsconfig from '../aws-exports';
	import amplifyStore from '$stores/amplify';
	import { checkUser } from '$lib/Auth/aws';
	import authUser from '$stores/auth.js';

	import Amplify, { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
	Amplify.configure(awsconfig);

	let segment;
	let unsubscribe;
	let cognitoUser;

	$: if (cognitoUser) {
		console.log('layout, cognito user:', { cognitoUser });
		$session.user.email = cognitoUser.attributes.email;
		console.log({ session });
		console.log('session.user', $session.user);

		/** a.s. this example below is set in src/setup/index.js
		 * renamed to src/hooks/index.js
		 */
		console.log('session.adnanTest', $session.adnanTest);

		goto('/');
	}

	onMount(async () => {
		try {
			/**
			 * a.s. Import Amplify
			 * onMount happens only on the client side
			 * No need for: if (typeof window === 'undefined') return;
			 * or if (browser) {}
			 */

			/**
			 * Get Amplify - no need for this anymore
			 */
			// const [Amplify, Auth, API, graphqlOperation, Storage] = await Promise.all([
			// 	import('@aws-amplify/core'),
			// 	import('@aws-amplify/auth'),
			// 	import('@aws-amplify/api'),
			// 	import('@aws-amplify/api-graphql'),
			// 	import('@aws-amplify/storage')
			// ]);

			// configure amplify
			// Amplify.default.configure(awsconfig);

			/**
			 * Store Amplify values for other components and
			 * pages to use
			 */
			amplifyStore.setAwsAmplify(Amplify);
			amplifyStore.setAwsAPI(API);
			amplifyStore.setAwsAuth(Auth);
			amplifyStore.setAwsGraphqlOperation(graphqlOperation);
			amplifyStore.setAwsStorage(Storage);

			console.log('layout', { Amplify, API, graphqlOperation, Auth, Storage });

			unsubscribe = authUser.subscribe((user) => {
				if (user) {
					cognitoUser = user;
				}
			});

			if (!cognitoUser) {
				console.log('layout: !cognitoUser');

				const res = await checkUser();
				authUser.setauthUser(res);
			}
		} catch (error) {
			console.log(error);
		}
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<Nav {segment} />

<main>
	<slot />
</main>

<style global>
	div {
		color: olivedrab;
	}
</style>
