import { InteractiveBrowserCredential } from '@azure/identity';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem } from '../types';
import { Container, CosmosClient } from '@azure/cosmos';
import { buildTree } from '../helpers';

let cosmosClient: CosmosClient;
let container: Container;

export default {
  name: 'cosmosdb',

  initialize() {
    const endpoint = import.meta.env.VITE_AZURE_COSMOSDB_ENDPOINT;
    const databaseName = import.meta.env.VITE_AZURE_COSMOSDB_DATABASE;
    const containerName = import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER;

    cosmosClient = new CosmosClient({
      endpoint,
      aadCredentials: new InteractiveBrowserCredential({
        clientId: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
        tenantId: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
      }),
    });

    container = cosmosClient.database(databaseName).container(containerName);

    container.read().then(console.log)
  },

  async getDocuments(): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    // can be improved...
    const query = 'SELECT * FROM document'; // Modify this query as needed
    const { resources } = await container.items.query(query).fetchAll();
    const rootItems: DocumentItem[] = resources.filter(
      (item) => item.parent == null,
    );
    const tree = rootItems.map((rootItem) => buildTree(rootItem, resources));
    return {
      tree,
      list: resources,
    };
  },

  async getDataForDocument(id: string): Promise<DocumentItem> {
    console.log('getDataForDocument');
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
    console.log('addDocument');
    throw 'not implemented';
  },

  async dropDocument(id: string): Promise<void> {
    console.log('dropDocument');
    throw 'not implemented';
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    console.log('updateDocument');
    throw 'not implemented';
  },
} satisfies DataProvider;
