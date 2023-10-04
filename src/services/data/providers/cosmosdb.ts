import { InteractiveBrowserCredential } from '@azure/identity';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem, Medium, DocumentQuery } from '../types';
import { Container, CosmosClient } from '@azure/cosmos';
import { buildTree } from '../helpers';
import env from '../../../services/env';

let cosmosClient: CosmosClient;
let container: Container;
let mediaContainer: Container;

const AUTHENTICATION_TYPE = env.VITE_AZURE_AUTHENTICATION_TYPE || 'ad';

export default {
  name: 'cosmosdb',

  initialize() {
    console.log(`Authentication to CosmosDB via '${AUTHENTICATION_TYPE}'...`);

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
        env.VITE_AZURE_COSMOSDB_CONNECTION_STRING,
      );
    } else {
      throw Error(`Unknown authentication type.`);
    }

    const databaseName = env.VITE_AZURE_COSMOSDB_DATABASE;

    container = cosmosClient
      .database(databaseName)
      .container(env.VITE_AZURE_COSMOSDB_CONTAINER);

    mediaContainer = cosmosClient
      .database(databaseName)
      .container(env.VITE_AZURE_COSMOSDB_CONTAINER_MEDIA);
  },

  async getDocuments(query?: DocumentQuery): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    // can be improved...
    let sql = 'SELECT * FROM document'; // Modify this query as needed
    // filter by langCode if set
    if (query?.langCode) {
      sql += ` WHERE document.langCode = '${query.langCode}'`;
    }

    const { resources } = await container.items.query(sql).fetchAll();

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
    await container.item(id, id).delete();
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    await container.item(document.id, document.id).replace(document);
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id) {
    const response = await mediaContainer.item(id, id).read<Medium>();
    return response.resource;
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        await container.item(id, id).delete();
      }),
    );
  },

  async moveNode(id: string, parentId: string): Promise<void> {
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM document d WHERE d.id = @id',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();

    if (resources.length === 0) {
      throw new Error(`Document with id ${id} not found`);
    }

    const document = resources[0];

    document.parent = parentId;

    await container.item(document.id).replace(document);
  },
} satisfies DataProvider;
