import { AzureOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { loadSummarizationChain } from "langchain/chains";

export class AzureOpenAIClient {
  private model: AzureOpenAI;

  constructor(azureOpenAIEndpoint: string, azureOpenAIkey: string, model: string = "gpt-3.5-turbo", temperature: number = 0.7, maxTokens: number = 1000) {   
    this.model = new AzureOpenAI({
      openAIBasePath: azureOpenAIEndpoint,
      apiKey: azureOpenAIkey,
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000 
    });
  }

  private extractInstanceName(endpoint: string): string {
    return endpoint.split("//")[1].split(".")[0];
  }

  public async summarize(prompt: string, data: string, chunkSize: number = 1000, chunkOverlap: number = 200): Promise<string> {
    
    // Split the input data
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

    const documents: Document[] = await splitter.createDocuments([data]);

    const documentsWithPrompt = documents.map(doc => new Document({
      pageContent: `${prompt}\n<log>\n${document.textContent}\n<log>`,
    }));

    const chain = await loadSummarizationChain(this.model, {
      type: "map_reduce",
    });

    const result = await chain.invoke(documentsWithPrompt);
    const summary = result.summary;

    return summary;
  }
}