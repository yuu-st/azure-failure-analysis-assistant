"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureOpenAIClient = void 0;
const openai_1 = require("@langchain/openai");
const text_splitter_1 = require("langchain/text_splitter");
const document_1 = require("langchain/document");
const chains_1 = require("langchain/chains");
class AzureOpenAIClient {
    constructor(azureOpenAIEndpoint, azureOpenAIkey, model = "gpt-3.5-turbo", temperature = 0.7, maxTokens = 1000) {
        this.model = new openai_1.AzureOpenAI({
            openAIBasePath: azureOpenAIEndpoint,
            apiKey: azureOpenAIkey,
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            maxTokens: 1000
        });
    }
    extractInstanceName(endpoint) {
        return endpoint.split("//")[1].split(".")[0];
    }
    async summarize(prompt, data, chunkSize = 1000, chunkOverlap = 200) {
        // Split the input data
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: chunkSize,
            chunkOverlap: chunkOverlap,
        });
        const documents = await splitter.createDocuments([data]);
        const documentsWithPrompt = documents.map(doc => new document_1.Document({
            pageContent: `${prompt}\n<log>\n${document.textContent}\n<log>`,
        }));
        const chain = await (0, chains_1.loadSummarizationChain)(this.model, {
            type: "map_reduce",
        });
        const result = await chain.invoke(documentsWithPrompt);
        const summary = result.summary;
        return summary;
    }
}
exports.AzureOpenAIClient = AzureOpenAIClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXp1cmUtb3BlbmFpLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xhbWJkYS9saWIvYXp1cmUtb3BlbmFpLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBZ0Q7QUFDaEQsMkRBQXlFO0FBQ3pFLGlEQUE4QztBQUM5Qyw2Q0FBMEQ7QUFFMUQsTUFBYSxpQkFBaUI7SUFHNUIsWUFBWSxtQkFBMkIsRUFBRSxjQUFzQixFQUFFLFFBQWdCLGVBQWUsRUFBRSxjQUFzQixHQUFHLEVBQUUsWUFBb0IsSUFBSTtRQUNuSixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0JBQVcsQ0FBQztZQUMzQixjQUFjLEVBQUUsbUJBQW1CO1lBQ25DLE1BQU0sRUFBRSxjQUFjO1lBQ3RCLEtBQUssRUFBRSxlQUFlO1lBQ3RCLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxRQUFnQjtRQUMxQyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsWUFBb0IsSUFBSSxFQUFFLGVBQXVCLEdBQUc7UUFFdkcsdUJBQXVCO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLElBQUksOENBQThCLENBQUM7WUFDbEQsU0FBUyxFQUFFLFNBQVM7WUFDcEIsWUFBWSxFQUFFLFlBQVk7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQWUsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyRSxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLG1CQUFRLENBQUM7WUFDNUQsV0FBVyxFQUFFLEdBQUcsTUFBTSxZQUFZLFFBQVEsQ0FBQyxXQUFXLFNBQVM7U0FDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsK0JBQXNCLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNyRCxJQUFJLEVBQUUsWUFBWTtTQUNuQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBRS9CLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQXhDRCw4Q0F3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBenVyZU9wZW5BSSB9IGZyb20gXCJAbGFuZ2NoYWluL29wZW5haVwiO1xyXG5pbXBvcnQgeyBSZWN1cnNpdmVDaGFyYWN0ZXJUZXh0U3BsaXR0ZXIgfSBmcm9tIFwibGFuZ2NoYWluL3RleHRfc3BsaXR0ZXJcIjtcclxuaW1wb3J0IHsgRG9jdW1lbnQgfSBmcm9tIFwibGFuZ2NoYWluL2RvY3VtZW50XCI7XHJcbmltcG9ydCB7IGxvYWRTdW1tYXJpemF0aW9uQ2hhaW4gfSBmcm9tIFwibGFuZ2NoYWluL2NoYWluc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF6dXJlT3BlbkFJQ2xpZW50IHtcclxuICBwcml2YXRlIG1vZGVsOiBBenVyZU9wZW5BSTtcclxuXHJcbiAgY29uc3RydWN0b3IoYXp1cmVPcGVuQUlFbmRwb2ludDogc3RyaW5nLCBhenVyZU9wZW5BSWtleTogc3RyaW5nLCBtb2RlbDogc3RyaW5nID0gXCJncHQtMy41LXR1cmJvXCIsIHRlbXBlcmF0dXJlOiBudW1iZXIgPSAwLjcsIG1heFRva2VuczogbnVtYmVyID0gMTAwMCkgeyAgIFxyXG4gICAgdGhpcy5tb2RlbCA9IG5ldyBBenVyZU9wZW5BSSh7XHJcbiAgICAgIG9wZW5BSUJhc2VQYXRoOiBhenVyZU9wZW5BSUVuZHBvaW50LFxyXG4gICAgICBhcGlLZXk6IGF6dXJlT3BlbkFJa2V5LFxyXG4gICAgICBtb2RlbDogXCJncHQtMy41LXR1cmJvXCIsXHJcbiAgICAgIHRlbXBlcmF0dXJlOiAwLjcsXHJcbiAgICAgIG1heFRva2VuczogMTAwMCBcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBleHRyYWN0SW5zdGFuY2VOYW1lKGVuZHBvaW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGVuZHBvaW50LnNwbGl0KFwiLy9cIilbMV0uc3BsaXQoXCIuXCIpWzBdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHN1bW1hcml6ZShwcm9tcHQ6IHN0cmluZywgZGF0YTogc3RyaW5nLCBjaHVua1NpemU6IG51bWJlciA9IDEwMDAsIGNodW5rT3ZlcmxhcDogbnVtYmVyID0gMjAwKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIFxyXG4gICAgLy8gU3BsaXQgdGhlIGlucHV0IGRhdGFcclxuICAgIGNvbnN0IHNwbGl0dGVyID0gbmV3IFJlY3Vyc2l2ZUNoYXJhY3RlclRleHRTcGxpdHRlcih7XHJcbiAgICAgIGNodW5rU2l6ZTogY2h1bmtTaXplLFxyXG4gICAgICBjaHVua092ZXJsYXA6IGNodW5rT3ZlcmxhcCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGRvY3VtZW50czogRG9jdW1lbnRbXSA9IGF3YWl0IHNwbGl0dGVyLmNyZWF0ZURvY3VtZW50cyhbZGF0YV0pO1xyXG5cclxuICAgIGNvbnN0IGRvY3VtZW50c1dpdGhQcm9tcHQgPSBkb2N1bWVudHMubWFwKGRvYyA9PiBuZXcgRG9jdW1lbnQoe1xyXG4gICAgICBwYWdlQ29udGVudDogYCR7cHJvbXB0fVxcbjxsb2c+XFxuJHtkb2N1bWVudC50ZXh0Q29udGVudH1cXG48bG9nPmAsXHJcbiAgICB9KSk7XHJcblxyXG4gICAgY29uc3QgY2hhaW4gPSBhd2FpdCBsb2FkU3VtbWFyaXphdGlvbkNoYWluKHRoaXMubW9kZWwsIHtcclxuICAgICAgdHlwZTogXCJtYXBfcmVkdWNlXCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjaGFpbi5pbnZva2UoZG9jdW1lbnRzV2l0aFByb21wdCk7XHJcbiAgICBjb25zdCBzdW1tYXJ5ID0gcmVzdWx0LnN1bW1hcnk7XHJcblxyXG4gICAgcmV0dXJuIHN1bW1hcnk7XHJcbiAgfVxyXG59Il19