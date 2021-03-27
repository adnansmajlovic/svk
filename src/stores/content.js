/**
 * https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi
 *
 * Here's a really quick tip for you today; how to use Svelte
 * stores to keep data in-sync with local storage.
 * This is particularly useful if you're wanting to persist
 * some user values, say UI configuration (e.g. their
 * preferred theme, something that is shown/hidden, etc) and
 * have the settings retained for future sessions.
 * Doing this with Svelte is pretty trivial,
 * let's check it out 👇
 *
 */
import { writable } from 'svelte/store';

// Get the value out of storage on load.
// const stored = localStorage.content;
const stored = localStorage.getItem('content');
// or localStorage.getItem('content')

// Set the stored value or a sane default.
export const content = writable(stored || 'Hello, World!');

// Anytime the store changes, update the local storage value.
content.subscribe((value) => (localStorage.content = value));
// or localStorage.setItem('content', value)
