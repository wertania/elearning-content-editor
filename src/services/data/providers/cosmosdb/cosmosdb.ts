import { InteractiveBrowserCredential } from "@azure/identity";
import { DocumentItem } from "../../types";
import type {
  DataProvider,
  DocumentQuery,
  DocumentTreeItem,
  Medium,
  MediumQuery,
} from "../../types";
import { Container, CosmosClient } from "@azure/cosmos";
import { buildTree, fileTypeToMediaType } from "../../helpers";
import env from "../../../env";
import { blobService } from "../../../blob";
import { guid } from "../../../guid";

let container: Container;
let mediaContainer: Container;

const AUTHENTICATION_TYPE = env.VITE_AZURE_AUTHENTICATION_TYPE || "ad";

export default {
  name: "cosmosdb",

  cache: {
    cosmosClient: <undefined | CosmosClient> undefined,
  },

  async checkLogin(): Promise<boolean> {
    if (this.cache.cosmosClient != null) return true;
    else return false;
  },

  async login(data: any): Promise<boolean> {
    return true;
  },

  async logout(): Promise<void> {
    this.cache.cosmosClient = undefined;
  },

  initialize() {
    console.log(`Authentication to CosmosDB via '${AUTHENTICATION_TYPE}'...`);

    if (AUTHENTICATION_TYPE === "ad") {
      const endpoint = import.meta.env.VITE_AZURE_COSMOSDB_ENDPOINT;

      this.cache.cosmosClient = new CosmosClient({
        endpoint,
        aadCredentials: new InteractiveBrowserCredential({
          clientId: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
          tenantId: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
        }),
      });
    } else if (AUTHENTICATION_TYPE === "connection-string") {
      this.cache.cosmosClient = new CosmosClient(
        env.VITE_AZURE_COSMOSDB_CONNECTION_STRING,
      );
    } else {
      throw Error(`Unknown authentication type.`);
    }

    const databaseName = env.VITE_AZURE_COSMOSDB_DATABASE;

    container = this.cache.cosmosClient
      .database(databaseName)
      .container(env.VITE_AZURE_COSMOSDB_CONTAINER);

    mediaContainer = this.cache.cosmosClient
      .database(databaseName)
      .container(env.VITE_AZURE_COSMOSDB_CONTAINER_MEDIA);
  },

  async getDocuments(query?: DocumentQuery): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    // can be improved...
    let sql = "SELECT * FROM document"; // Modify this query as needed
    // filter by langCode if set
    if (query?.langCodes) {
      sql += ` WHERE document.langCode = '${
        query.langCodes.join(
          `' OR document.langCode = '`,
        )
      }'`;
    }
    // filter by hasOrigin if set
    if (query?.hasOrigin) {
      sql += ` ${
        Object.keys(query).length > 1 ? "AND" : "WHERE"
      } document.originId != null`;
    }
    // filter by originId if set
    if (query?.originId) {
      sql += ` ${
        Object.keys(query).length > 1 ? "AND" : "WHERE"
      } document.originId = '${query.originId}'`;
    }
    // "noContent" not implemented yet

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
        query: "SELECT * FROM document d WHERE d.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();

    if (resources.length === 0) {
      throw new Error(`Document with id ${id} not found`);
    }

    return resources[0];
  },

  async addDocument(document: DocumentItem): Promise<DocumentItem> {
    const doc = await container.items.create(document);
    if (!doc.resource) throw Error("Failed to create document");
    return doc.resource;
  },

  async dropDocument(id: string): Promise<void> {
    await container.item(id, id).delete();
  },

  async updateDocument(document: DocumentItem): Promise<DocumentItem> {
    const doc = await container.item(document.id, document.id).replace(
      document,
    );
    if (!doc.resource) throw Error("Failed to update document");
    return doc.resource;
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id) {
    const response = await mediaContainer.item(id, id).read<Medium>();
    return response.resource;
  },

  async getMediums(query?: MediumQuery): Promise<Medium[]> {
    if (!query) {
      const response = await mediaContainer.items.readAll<Medium>().fetchAll();
      return response.resources;
    } else {
      let sql = "SELECT * FROM media";
      let first = true;
      if (query.type) {
        sql += ` ${first ? "WHERE" : "AND"} media.type = '${query.type}'`;
        first = false;
      }
      if (query.documentId) {
        first = false;
      }
      if (query.originId) {
        sql += ` ${
          first ? "WHERE" : "AND"
        } media.originId = '${query.originId}'`;
        first = false;
      }
      const { resources } = await mediaContainer.items
        .query(sql)
        .fetchAll();
      return resources;
    }
  },

  async addMedium(
    file: File,
    langCode: string,
    sourceDocumentId?: string | string[],
    originId?: string,
  ): Promise<Medium> {
    // Upload to the blob storage.
    const { url } = await blobService.upload(file.name, file);

    // Create medium object.
    const medium: Medium = {
      id: guid(),
      version: 1,
      // TODO
      hash: "",
      name: file.name,
      filename: file.name,
      type: fileTypeToMediaType(file),
      url,
      langCode,
      originId,
      documents: sourceDocumentId
        ? (Array.isArray(sourceDocumentId)
          ? sourceDocumentId
          : [sourceDocumentId])
        : [],
    };

    // Create CosmosDB entry.
    const res = await mediaContainer.items.create(medium);

    if (!res.resource) {
      throw Error(`Failed to create a medium with name "${file.name}".`);
    }

    return res.resource;
  },

  async updateMedium(id: string, file: File): Promise<Medium> {
    const medium = await this.getMedium(id);
    if (!medium) {
      throw Error(`The medium with ID "${id}" could not be found.`);
    }
    // replace file in blob storage
    const { url } = await blobService.upload(medium.filename, file);
    // update medium
    medium.url = url;
    return medium;
  },

  async getMediumUrl(mediumId) {
    const medium = await this.getMedium(mediumId);
    if (!medium) {
      throw Error(`The medium with ID "${mediumId}" could not be found.`);
    }

    return await blobService.generateSasUrl(medium.url);
  },

  async dropMedium(mediumId: string): Promise<void> {
    await mediaContainer.item(mediumId, mediumId).delete();
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
        query: "SELECT * FROM document d WHERE d.id = @id",
        parameters: [{ name: "@id", value: id }],
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
