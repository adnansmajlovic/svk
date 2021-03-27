import { writable } from 'svelte/store';

const awsAmplify = writable(false);
const awsGraphqlOperation = writable(false);
const awsAPI = writable(false);
const awsAuth = writable(false);
const awsStorage = writable(false);

const amplifyStore = {
  subscribe: awsAmplify.subscribe,
  subscribeGQL: awsGraphqlOperation.subscribe,
  subscribeAPI: awsAPI.subscribe,
  subscribeAuth: awsAuth.subscribe,
  subscribeStorage: awsStorage.subscribe,
  setAwsAmplify: (item) => {
    awsAmplify.set(item);
  },
  removeAwsAmplify: () => {
    awsAmplify.set(null);
  },
  setAwsGraphqlOperation: (item) => {
    awsGraphqlOperation.set(item);
  },
  removeAwsGraphqlOperation: () => {
    awsGraphqlOperation.set(null);
  },
  setAwsAPI: (item) => {
    awsAPI.set(item);
  },
  removeAwsAPI: () => {
    awsAPI.set(null);
  },
  setAwsAuth: (item) => {
    awsAuth.set(item);
  },
  removeAwsAuth: () => {
    awsAuth.set(null);
  },
  setAwsStorage: (item) => {
    awsStorage.set(item);
  },
  removeAwsStorage: () => {
    awsStorage.set(null);
  },
};

export default amplifyStore;
