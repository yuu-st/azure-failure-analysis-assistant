import { Logger } from "./logger.js";
/**
 * AzureStorageBlob provides methods for interacting with Azure Blob Storage.
 */
export declare class AzureStorageBlobClient {
    private storageAccountName;
    private containerName;
    private logger;
    private containerClient;
    /**
     * Creates an instance of AzureStorageBlob.
     *
     * @param logger - Logger instance for structured logging
     */
    constructor(logger: Logger, storageAccountName: string, containerName: string);
    /**
     * Loads all blobs from the container and returns their contents.
     *
     * @returns A map of blob names to their string contents.
     */
    loadAllBlobs(): Promise<Record<string, string>>;
}
