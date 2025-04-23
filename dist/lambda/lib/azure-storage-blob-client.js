"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorageBlobClient = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const identity_1 = require("@azure/identity");
const utils_js_1 = require("./utils.js");
/**
 * AzureStorageBlob provides methods for interacting with Azure Blob Storage.
 */
class AzureStorageBlobClient {
    /**
     * Creates an instance of AzureStorageBlob.
     *
     * @param logger - Logger instance for structured logging
     */
    constructor(logger, storageAccountName, containerName) {
        if (!storageAccountName || !containerName) {
            throw new Error("STORAGE_ACCOUNT_NAME or CONTAINER_NAME is not defined.");
        }
        this.storageAccountName = storageAccountName;
        this.containerName = containerName;
        this.logger = logger;
        const url = `https://${this.storageAccountName}.blob.core.windows.net`;
        const credential = new identity_1.DefaultAzureCredential();
        const blobServiceClient = new storage_blob_1.BlobServiceClient(url, credential);
        this.containerClient = blobServiceClient.getContainerClient(this.containerName);
    }
    /**
     * Loads all blobs from the container and returns their contents.
     *
     * @returns A map of blob names to their string contents.
     */
    async loadAllBlobs() {
        const input = {};
        this.logger.info(`Reading blobs from container: "${this.containerName}"...`);
        try {
            for await (const blob of this.containerClient.listBlobsFlat()) {
                const blobClient = this.containerClient.getBlobClient(blob.name);
                const response = await blobClient.download();
                if (response.readableStreamBody) {
                    const content = await (0, utils_js_1.streamToString)(this.logger, response.readableStreamBody);
                    input[blob.name] = content;
                    this.logger.info(`Successfully read: ${blob.name}`);
                }
                else {
                    this.logger.warn(`No stream found for: ${blob.name}`);
                }
            }
            this.logger.info("All blobs have been processed.");
            return input;
        }
        catch (err) {
            this.logger.error("Error occurred while loading blobs:", err);
            throw err;
        }
    }
}
exports.AzureStorageBlobClient = AzureStorageBlobClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXp1cmUtc3RvcmFnZS1ibG9iLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xhbWJkYS9saWIvYXp1cmUtc3RvcmFnZS1ibG9iLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBd0U7QUFDeEUsOENBQXlEO0FBRXpELHlDQUE0QztBQUU1Qzs7R0FFRztBQUNILE1BQWEsc0JBQXNCO0lBTWpDOzs7O09BSUc7SUFDSCxZQUFZLE1BQWMsRUFBRSxrQkFBMEIsRUFBRSxhQUFxQjtRQUUzRSxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixNQUFNLEdBQUcsR0FBRyxXQUFXLElBQUksQ0FBQyxrQkFBa0Isd0JBQXdCLENBQUM7UUFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxpQ0FBc0IsRUFBRSxDQUFDO1FBQ2hELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxnQ0FBaUIsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsWUFBWTtRQUN2QixNQUFNLEtBQUssR0FBMkIsRUFBRSxDQUFDO1FBRXpDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxJQUFJLENBQUMsYUFBYSxNQUFNLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUM7WUFDRCxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7Z0JBQzVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakUsTUFBTSxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRTdDLElBQUksUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSx5QkFBYyxFQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxrQkFBMkMsQ0FDcEUsQ0FBQztvQkFDRixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO3FCQUFNLENBQUM7b0JBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRCxDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RCxNQUFNLEdBQUcsQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0NBRUY7QUE1REQsd0RBNERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmxvYlNlcnZpY2VDbGllbnQsIENvbnRhaW5lckNsaWVudH0gZnJvbSBcIkBhenVyZS9zdG9yYWdlLWJsb2JcIjtcclxuaW1wb3J0IHsgRGVmYXVsdEF6dXJlQ3JlZGVudGlhbCB9IGZyb20gXCJAYXp1cmUvaWRlbnRpdHlcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyLmpzXCI7XHJcbmltcG9ydCB7IHN0cmVhbVRvU3RyaW5nIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcclxuXHJcbi8qKlxyXG4gKiBBenVyZVN0b3JhZ2VCbG9iIHByb3ZpZGVzIG1ldGhvZHMgZm9yIGludGVyYWN0aW5nIHdpdGggQXp1cmUgQmxvYiBTdG9yYWdlLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEF6dXJlU3RvcmFnZUJsb2JDbGllbnQge1xyXG4gIHByaXZhdGUgc3RvcmFnZUFjY291bnROYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBjb250YWluZXJOYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcjtcclxuICBwcml2YXRlIGNvbnRhaW5lckNsaWVudDogQ29udGFpbmVyQ2xpZW50O1xyXG4gIFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXp1cmVTdG9yYWdlQmxvYi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBsb2dnZXIgLSBMb2dnZXIgaW5zdGFuY2UgZm9yIHN0cnVjdHVyZWQgbG9nZ2luZ1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VyLCBzdG9yYWdlQWNjb3VudE5hbWU6IHN0cmluZywgY29udGFpbmVyTmFtZTogc3RyaW5nKSB7XHJcbiAgICBcclxuICAgIGlmICghc3RvcmFnZUFjY291bnROYW1lIHx8ICFjb250YWluZXJOYW1lKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNUT1JBR0VfQUNDT1VOVF9OQU1FIG9yIENPTlRBSU5FUl9OQU1FIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3JhZ2VBY2NvdW50TmFtZSA9IHN0b3JhZ2VBY2NvdW50TmFtZTtcclxuICAgIHRoaXMuY29udGFpbmVyTmFtZSA9IGNvbnRhaW5lck5hbWU7XHJcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjsgIFxyXG5cclxuICAgIGNvbnN0IHVybCA9IGBodHRwczovLyR7dGhpcy5zdG9yYWdlQWNjb3VudE5hbWV9LmJsb2IuY29yZS53aW5kb3dzLm5ldGA7XHJcbiAgICBjb25zdCBjcmVkZW50aWFsID0gbmV3IERlZmF1bHRBenVyZUNyZWRlbnRpYWwoKTtcclxuICAgIGNvbnN0IGJsb2JTZXJ2aWNlQ2xpZW50ID0gbmV3IEJsb2JTZXJ2aWNlQ2xpZW50KHVybCwgY3JlZGVudGlhbCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lckNsaWVudCA9IGJsb2JTZXJ2aWNlQ2xpZW50LmdldENvbnRhaW5lckNsaWVudCh0aGlzLmNvbnRhaW5lck5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZHMgYWxsIGJsb2JzIGZyb20gdGhlIGNvbnRhaW5lciBhbmQgcmV0dXJucyB0aGVpciBjb250ZW50cy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIGJsb2IgbmFtZXMgdG8gdGhlaXIgc3RyaW5nIGNvbnRlbnRzLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBsb2FkQWxsQmxvYnMoKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiB7XHJcbiAgICBjb25zdCBpbnB1dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG5cclxuICAgIHRoaXMubG9nZ2VyLmluZm8oYFJlYWRpbmcgYmxvYnMgZnJvbSBjb250YWluZXI6IFwiJHt0aGlzLmNvbnRhaW5lck5hbWV9XCIuLi5gKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBibG9iIG9mIHRoaXMuY29udGFpbmVyQ2xpZW50Lmxpc3RCbG9ic0ZsYXQoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBibG9iQ2xpZW50ID0gdGhpcy5jb250YWluZXJDbGllbnQuZ2V0QmxvYkNsaWVudChibG9iLm5hbWUpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGJsb2JDbGllbnQuZG93bmxvYWQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZWFkYWJsZVN0cmVhbUJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBzdHJlYW1Ub1N0cmluZyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlciwgcmVzcG9uc2UucmVhZGFibGVTdHJlYW1Cb2R5IGFzIE5vZGVKUy5SZWFkYWJsZVN0cmVhbSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dFtibG9iLm5hbWVdID0gY29udGVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYFN1Y2Nlc3NmdWxseSByZWFkOiAke2Jsb2IubmFtZX1gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYE5vIHN0cmVhbSBmb3VuZCBmb3I6ICR7YmxvYi5uYW1lfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oXCJBbGwgYmxvYnMgaGF2ZSBiZWVuIHByb2Nlc3NlZC5cIik7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoXCJFcnJvciBvY2N1cnJlZCB3aGlsZSBsb2FkaW5nIGJsb2JzOlwiLCBlcnIpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICB9XHJcblxyXG59Il19