import MockProvider from "./providers/mock/mock";
import CosmosDbProvider from "./providers/cosmosdb/cosmosdb";
import LocaldbProvider from "./providers/localdb/localdb";
import PocketBaseProvider from "./providers/pocketbase/pocketbase";
import type { DataProvider } from "./types";
import env from "../env";

// Register your providers here.
const providerOptions: DataProvider[] = [
  MockProvider,
  CosmosDbProvider,
  LocaldbProvider,
  PocketBaseProvider,
];

// Instantiate a provider.
export const dataProvider = (() => {
  const providerName = env.VITE_DOCUMENT_DATASOURCE || "localdb";
  console.log(`Using data provider '${providerName}'.`);

  for (const p of providerOptions) {
    if (p.name === providerName) {
      return p;
    }
  }

  throw Error(`Cannot find unregistered data provider '${providerName}'.`);
})();
