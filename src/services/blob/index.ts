import { BlobClient } from '@azure/storage-blob';
import { InteractiveBrowserCredential } from '@azure/identity';
import env from '../env';

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
    const base = env.VITE_AZURE_BLOB_STORAGE_URL;
    const containerName = env.VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME;

    const credential = new InteractiveBrowserCredential({
      clientId: env.VITE_AZURE_COSMOSDB_CLIENT_ID,
      tenantId: env.VITE_AZURE_COSMOSDB_TENANT_ID,
      // redirectUri: 'https://example.com',
    });

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

    console.log(response);

    return {
      response,
      url: blob.url,
    };
  },
};
