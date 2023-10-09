import MockProvider from './providers/mock';
import CosmosDbProvider from './providers/cosmosdb';
import LocaldbProvider from './providers/localdb';
import type { DataProvider } from './types';
import env from '../env';

// Register your providers here.
const providerOptions: DataProvider[] = [
  // MockProvider,
  CosmosDbProvider,
  LocaldbProvider,
];

// Instantiate a provider.
export const dataProvider = (() => {
  const providerName = env.VITE_DOCUMENT_DATASOURCE;

  for (const p of providerOptions) {
    if (p.name === providerName) {
      // Initialize the provider and return it.
      p.initialize?.();

      return p;
    }
  }

  throw Error(`Cannot find unregistered data provider '${providerName}'.`);
})();
