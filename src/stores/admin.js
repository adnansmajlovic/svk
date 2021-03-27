import {
  writable
} from 'svelte/store';

const isAdmin = writable(false);

const isAdminStore = {
  subscribe: isAdmin.subscribe,
  setIsAdmin: (item) => {
    isAdmin.set(item);
  },
  removeIsAdmin: () => {
    isAdmin.set(null);
  }
};

export default isAdminStore;