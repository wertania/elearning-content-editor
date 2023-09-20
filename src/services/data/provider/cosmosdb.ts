import { InteractiveBrowserCredential } from "@azure/identity";
import { DocumentItem } from "../types";
import type { DocumentTreeItem } from "../types";
import { CosmosClient } from "@azure/cosmos";

const endpoint = import.meta.env.VITE_AZURE_COSMOSDB_ENDPOINT;
const databaseName = import.meta.env.VITE_AZURE_COSMOSDB_DATABSE;
const containerName = import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER;
const cosmosClient = new CosmosClient({
  endpoint,
  aadCredentials: new InteractiveBrowserCredential({
    clientId: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
  }),
});
const container = cosmosClient.database(databaseName).container(
  containerName,
);

const test = async () => {
  const query = "SELECT * FROM document"; // Modify this query as needed
  const { resources } = await container.items.query(query).fetchAll();

  console.log(resources);
};
test();

/**
 * helper function to build the tree
 */
function buildTree(
  item: DocumentItem,
  documents: DocumentItem[],
): DocumentTreeItem {
  const children = documents
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTree(childItem, documents));
  return {
    key: item.id,
    label: item.name,
    icon: item.icon ?? null,
    type: item.type,
    // data: => leeve this empty that the tree size is smaller! load data on demand
    children: children.length ? children : undefined,
  };
}

/**
 * Diese Stanardfunktionen braucht jeder Provider
 */
export default {
  name: "cosmosdb",
  async getDocuments(): Promise<
    { tree: DocumentTreeItem[]; list: DocumentItem[] }
  > {
    // can be improved...
    const query = "SELECT * FROM document"; // Modify this query as needed
    const { resources } = await container.items.query(query).fetchAll();
    const rootItems: DocumentItem[] = resources.filter((item) =>
      item.parent == null
    );
    const tree = rootItems.map((rootItem) => buildTree(rootItem, resources));
    return {
      tree,
      list: resources,
    };
  },

  async getDataForDocument(id: string): Promise<DocumentItem> {
    console.log("getDataForDocument");
    const { resources } = await container.items
      .query("SELECT * FROM document WHERE document.id = @id", {
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();
    if (resources.length === 0) {
      throw new Error(`Document with id ${id} not found`);
    }
    return resources[0];
  },

  async addDocument(document: DocumentItem): Promise<void> {
    console.log("addDocument");
    throw "not implemented";
  },

  async dropDocument(id: string): Promise<void> {
    console.log("dropDocument");
    throw "not implemented";
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    console.log("updateDocument");
    throw "not implemented";
  },
};
