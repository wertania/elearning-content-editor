import { InteractiveBrowserCredential } from '@azure/identity';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem, Medium } from '../types';
import { Container, CosmosClient } from '@azure/cosmos';
import { buildTree } from '../helpers';

const AUTHENTICATION_TYPE: 'ad' | 'connection-string' =
  import.meta.env.VITE_AUTHENTICATION_TYPE || 'ad';

let cosmosClient: CosmosClient;
let container: Container;
let mediaContainer: Container;

export default {
  name: 'cosmosdb',

  initialize() {
    if (AUTHENTICATION_TYPE === 'ad') {
      const endpoint = import.meta.env.VITE_AZURE_COSMOSDB_ENDPOINT;

      cosmosClient = new CosmosClient({
        endpoint,
        aadCredentials: new InteractiveBrowserCredential({
          clientId: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
          tenantId: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
        }),
      });
    } else if (AUTHENTICATION_TYPE === 'connection-string') {
      cosmosClient = new CosmosClient(
        import.meta.env.VITE_AZURE_COSMOSDB_CONNECTION_STRING,
      );
    }

    const databaseName = import.meta.env.VITE_AZURE_COSMOSDB_DATABASE;

    container = cosmosClient
      .database(databaseName)
      .container(import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER);

    mediaContainer = cosmosClient
      .database(databaseName)
      .container(import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER_MEDIA);
  },

  async getDocuments(): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    // can be improved...
    const query = 'SELECT * FROM document'; // Modify this query as needed
    const { resources } = await container.items.query(query).fetchAll();

    return {
      tree: buildTree(resources),
      list: resources,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM document d WHERE d.id = @id',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();

    if (resources.length === 0) {
      throw new Error(`Document with id ${id} not found`);
    }

    return resources[0];
  },

  async addDocument(document: DocumentItem): Promise<void> {
    await container.items.create(document);
  },

  async dropDocument(id: string): Promise<void> {
    await container.item(id).delete();
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    await container.item(document.id).replace(document);
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id) {
    const response = await mediaContainer.item(id).read<Medium>();
    return response.resource;
  },
} satisfies DataProvider;
