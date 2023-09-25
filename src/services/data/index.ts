import MockProvider from './providers/mock';
import CosmosDbProvider from './providers/cosmosdb';
import type { DataProvider } from './types';

// Register your providers here.
const providerOptions: DataProvider[] = [MockProvider, CosmosDbProvider];

// Instantiate a provider.
export const dataProvider = (() => {
  const providerName = import.meta.env.VITE_DOCUMENT_DATASOURCE;

  for (const p of providerOptions) {
    if (p.name === providerName) {
      // Initialize the provider and return it.
      p.initialize?.();

      return p;
    }
  }

  throw Error(`Cannot find unregistered data provider '${providerName}'.`);
})();
