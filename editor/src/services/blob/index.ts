import { BlobClient } from "@azure/storage-blob";
import { InteractiveBrowserCredential } from "@azure/identity";

const credential = new InteractiveBrowserCredential({
  clientId: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
  tenantId: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
});

interface BlobCreateOptions {
  /**
   * @param progress In the range `[0, 1]`.
   */
  onProgress?(progress: number): void;

  failIfExists?: boolean;
}

export const blobService = {
  async upload(blobName: string, data: Blob, options: BlobCreateOptions = {}) {
    // Get the blob client.
    const base = import.meta.env.VITE_AZURE_BLOB_STORAGE_URL;
    const containerName = import.meta.env.VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME;

    const blob = new BlobClient(
      `${base}/${containerName}/${blobName}`,
      credential,
    ).getBlockBlobClient();

    if (options.failIfExists && (await blob.exists())) {
      throw Error(`The blob "${blobName}" already exists.`);
    }

    const response = await blob.uploadData(data, {
      onProgress(progress) {
        options.onProgress?.(progress.loadedBytes / data.size);
      },
    });

    return {
      response,
      url: blob.url,
    };
  },

  async generateSasUrl(_blobUrl: string): Promise<string> {
    // TODO: Call an Azure Function that generates the URL.
    // This is good for access control and the browser authentication does not have the permission to generate these URLs.

    throw Error("Not implemented");
  },
};
