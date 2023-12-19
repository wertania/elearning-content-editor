import PocketBaseProvider from "./providers/pocketbase/pocketbase";
import type { DataProvider } from "./types";

// Register your providers here.
const providerOptions: DataProvider[] = [
  PocketBaseProvider,
];

// Instantiate a provider.
export const dataProvider = (() => {
  const providerName = import.meta.env.VITE_DOCUMENT_DATASOURCE;
  console.log(`Using data provider '${providerName}'.`);

  for (const p of providerOptions) {
    if (p.name === providerName) {
      return p;
    }
  }

  throw Error(`Cannot find unregistered data provider '${providerName}'.`);
})();
