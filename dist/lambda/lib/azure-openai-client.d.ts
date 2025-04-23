export declare class AzureOpenAIClient {
    private model;
    constructor(azureOpenAIEndpoint: string, azureOpenAIkey: string, model?: string, temperature?: number, maxTokens?: number);
    private extractInstanceName;
    summarize(prompt: string, data: string, chunkSize?: number, chunkOverlap?: number): Promise<string>;
}
