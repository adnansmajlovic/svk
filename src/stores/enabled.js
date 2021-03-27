/**
 * https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi
 *
 * The key thing to remember here is local storage always
 * stores strings, so if you're storing something else,
 * say a boolean or some JSON, then you will want to
 * convert to/from the data type you want and the local
 * storage string representation.
 *
 * For example, if you wanted to store a boolean, it would
 * look more like this:
 */
import { writable } from 'svelte/store';

const stored = localStorage.enabled;

export const enabled = writable < boolean > (stored ? stored === 'true' : true);

enabled.subscribe((value) => (localStorage.enabled = String(value)));
