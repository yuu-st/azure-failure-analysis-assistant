"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpTrigger = void 0;
const functions_1 = require("@azure/functions");
const prompts_js_1 = require("../lib/prompts.js");
const logger_js_1 = require("../lib/logger.js");
const azure_storage_blob_client_js_1 = require("../lib/azure-storage-blob-client.js");
const azure_openai_client_js_1 = require("../lib/azure-openai-client.js");
async function httpTrigger(req, context) {
    const logger = new logger_js_1.Logger(context, "AzureFailureAnalysisAssistant");
    const reqBody = await req.json();
    const { errorDescription, startDate, endDate, channelId, threadTs } = reqBody;
    logger.info("Request started", reqBody);
    // Environment variables
    //const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
    //const containerName = process.env.CONTAINER_NAME;
    //const lang: Language = process.env.LANG ? (process.env.LANG as Language) : "en";
    //const slackAppTokenKey = process.env.SLACK_APP_TOKEN_KEY!;
    //const architectureDescription = process.env.ARCHITECTURE_DESCRIPTION!;
    //const token = await getSecret(slackAppTokenKey);
    //const messageClient = new MessageClient(token!.toString(), lang);
    // Check required variables.
    //if (!modelId ||  !channelId || !threadTs) {
    //  logger.error(`Not found any environment variables. Please check.`, {environemnts: {modelId, channelId, threadTs}});
    /*
    if (channelId && threadTs) {
      messageClient.sendMessage(
        lang && lang === "ja"
          ? "エラーが発生しました: 環境変数が設定されていない、または渡されていない可能性があります。"
          : "Error: Not found any environment variables.",
        channelId,
        threadTs
      );
    }
    */
    /*
     return {
       status: 400,
       body: "Missing environment variables"
     };
   */
    try {
        // Process to retrieve files from Azure Storage Blob
        const storageAccountName = process.env["STORAGE_ACCOUNT_NAME"] ? process.env["STORAGE_ACCOUNT_NAME"] : "";
        const containerName = process.env["CONTAINER_NAME"] ? process.env["CONTAINER_NAME"] : "";
        const azureStorageBlobClient = new azure_storage_blob_client_js_1.AzureStorageBlobClient(logger, storageAccountName, containerName);
        const blobDataRecord = await azureStorageBlobClient.loadAllBlobs();
        const blobData = Object.values(blobDataRecord).join("\n");
        logger.info("retrieve files", { "blobData": blobData });
        // generate a prompt
        const lang = "ja";
        const architectureDescription = "test";
        const prompt = new prompts_js_1.Prompt(lang, architectureDescription).createLogAnalysisPrompt();
        logger.info("Made prompt", { prompt: prompt });
        // generate a response using the LLM
        const azureOpenAIEndpoint = process.env["AZURE_OPENAI_ENDPOINT"] ? process.env["AZURE_OPENAI_ENDPOINT"] : "";
        const azureOpenAIKey = process.env["AZURE_OPENAI_KEY"] ? process.env["AZURE_OPENAI_KEY"] : "";
        const azureOpenAIClient = new azure_openai_client_js_1.AzureOpenAIClient(azureOpenAIEndpoint, azureOpenAIKey);
        const summary = await azureOpenAIClient.summarize(prompt, blobData, 1000, 200);
        logger.info("generate answer", { summary: summary });
        if (!summary)
            throw new Error("No response from LLM");
        // We assume that threshold is 3,500. And it's not accurate. Please modify this value when you met error. 
        //if(answer.length < 3500){
        // Send the answer to Slack directly.
        /*
        await messageClient.sendMessage(
          messageClient.createMessageBlock(answer),
          channelId,
          threadTs
        );
        */
        //logger.info(answer);
        //}else{
        // Send the snippet of answer instead of message due to limitation of message size.
        //await messageClient.sendMarkdownSnippet("answer.md", answer, channelId, threadTs)
        //}
        //logger.info('Success to get answer:', answer);
        /* ****** */
    }
    catch (error) {
        logger.error("Something happened", error);
        // Send the form to retry when error was occured.
        /*
        if(channelId && threadTs){
          await messageClient.sendMessage(
            messageClient.createErrorMessageBlock(),
            channelId,
            threadTs
          );
          await messageClient.sendMessage(
            messageClient.createMessageBlock(
              lang === "ja"
                ? "リトライしたい場合は、以下のフォームからもう一度同じ内容のリクエストを送ってください。"
                : "If you want to retry it, you send same request again from below form."
            ),
            channelId,
            threadTs
          );
          const now = toZonedTime(new Date(), "Asia/Tokyo");
          await messageClient.sendMessage(
            messageClient.createFormBlock(format(now, "yyyy-MM-dd"), format(now, "HH:mm")),
            channelId,
            threadTs
          )
        }
        */
    }
    return {
        status: 400,
        body: "Processed"
    };
}
exports.httpTrigger = httpTrigger;
;
functions_1.app.http('httpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: httpTrigger
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xhbWJkYS9mdW5jdGlvbnMvZmEyLWxhbWJkYS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUF5RjtBQUN6RixxREFBOEM7QUFDOUMsbURBQTZDO0FBQzdDLHlGQUFnRjtBQUNoRiw2RUFBcUU7QUFXOUQsS0FBSyxVQUFVLFdBQVcsQ0FBQyxHQUFnQixFQUFFLE9BQTBCO0lBRTVFLE1BQU0sTUFBTSxHQUFHLElBQUksa0JBQU0sQ0FBQyxPQUFPLEVBQUUsK0JBQStCLENBQUMsQ0FBQztJQUVwRSxNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQWlCLENBQUM7SUFDaEQsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXhDLHdCQUF3QjtJQUN4Qiw4REFBOEQ7SUFDOUQsbURBQW1EO0lBQ25ELGtGQUFrRjtJQUNsRiw0REFBNEQ7SUFDNUQsd0VBQXdFO0lBRXhFLGtEQUFrRDtJQUNsRCxtRUFBbUU7SUFFbkUsNEJBQTRCO0lBQzVCLDZDQUE2QztJQUM3Qyx1SEFBdUg7SUFDckg7Ozs7Ozs7Ozs7TUFVRTtJQUNIOzs7OztLQUtDO0lBR0YsSUFBSSxDQUFDO1FBQ0gsb0RBQW9EO1FBQ3BELE1BQU0sa0JBQWtCLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuSCxNQUFNLGFBQWEsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xHLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxxREFBc0IsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckcsTUFBTSxjQUFjLEdBQTJCLE1BQU0sc0JBQXNCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0YsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRXZELG9CQUFvQjtRQUNwQixNQUFNLElBQUksR0FBVyxJQUFJLENBQUM7UUFDMUIsTUFBTSx1QkFBdUIsR0FBVyxNQUFNLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBTSxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDbkYsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUU3QyxvQ0FBb0M7UUFDcEMsTUFBTSxtQkFBbUIsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JILE1BQU0sY0FBYyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEcsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDBDQUFpQixDQUFDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUVuRCxJQUFHLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUVyRCwwR0FBMEc7UUFDMUcsMkJBQTJCO1FBQ3pCLHFDQUFxQztRQUNyQzs7Ozs7O1VBTUU7UUFDSCxzQkFBc0I7UUFDdkIsUUFBUTtRQUNOLG1GQUFtRjtRQUNuRixtRkFBbUY7UUFDckYsR0FBRztRQUVILGdEQUFnRDtRQUdoRCxZQUFZO0lBRWQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEtBQWMsQ0FBQyxDQUFDO1FBQ25ELGlEQUFpRDtRQUNqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUF1QkU7SUFDSixDQUFDO0lBQ0QsT0FBTztRQUNMLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLFdBQVc7S0FDbEIsQ0FBQztBQUNKLENBQUM7QUFySEQsa0NBcUhDO0FBQUEsQ0FBQztBQUVGLGVBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ3RCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixPQUFPLEVBQUUsV0FBVztDQUNyQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEh0dHBSZXF1ZXN0LCBIdHRwUmVzcG9uc2VJbml0LCBJbnZvY2F0aW9uQ29udGV4dCB9IGZyb20gXCJAYXp1cmUvZnVuY3Rpb25zXCI7XHJcbmltcG9ydCB7IFByb21wdCB9IGZyb20gXCIuLi8uLi9saWIvcHJvbXB0cy5qc1wiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi4vLi4vbGliL2xvZ2dlci5qc1wiOyBcclxuaW1wb3J0IHsgQXp1cmVTdG9yYWdlQmxvYkNsaWVudCB9IGZyb20gXCIuLi8uLi9saWIvYXp1cmUtc3RvcmFnZS1ibG9iLWNsaWVudC5qc1wiO1xyXG5pbXBvcnQgeyBBenVyZU9wZW5BSUNsaWVudCB9IGZyb20gXCIuLi8uLi9saWIvYXp1cmUtb3BlbmFpLWNsaWVudC5qc1wiO1xyXG5cclxuXHJcbnR5cGUgUmVxdWVzdEJvYnkgPSB7XHJcbiAgZXJyb3JEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHN0YXJ0RGF0ZTogc3RyaW5nO1xyXG4gIGVuZERhdGU6IHN0cmluZztcclxuICBjaGFubmVsSWQ6IHN0cmluZztcclxuICB0aHJlYWRUczogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaHR0cFRyaWdnZXIocmVxOiBIdHRwUmVxdWVzdCwgY29udGV4dDogSW52b2NhdGlvbkNvbnRleHQpOiBQcm9taXNlPEh0dHBSZXNwb25zZUluaXQ+IHtcclxuXHJcbiAgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcihjb250ZXh0LCBcIkF6dXJlRmFpbHVyZUFuYWx5c2lzQXNzaXN0YW50XCIpO1xyXG4gXHJcbiAgY29uc3QgcmVxQm9keSA9IGF3YWl0IHJlcS5qc29uKCkgYXMgUmVxdWVzdEJvYnk7XHJcbiAgY29uc3QgeyBlcnJvckRlc2NyaXB0aW9uLCBzdGFydERhdGUsIGVuZERhdGUsIGNoYW5uZWxJZCwgdGhyZWFkVHMgfSA9IHJlcUJvZHk7XHJcbiAgbG9nZ2VyLmluZm8oXCJSZXF1ZXN0IHN0YXJ0ZWRcIiwgcmVxQm9keSk7XHJcblxyXG4gIC8vIEVudmlyb25tZW50IHZhcmlhYmxlc1xyXG4gIC8vY29uc3Qgc3RvcmFnZUFjY291bnROYW1lID0gcHJvY2Vzcy5lbnYuU1RPUkFHRV9BQ0NPVU5UX05BTUU7XHJcbiAgLy9jb25zdCBjb250YWluZXJOYW1lID0gcHJvY2Vzcy5lbnYuQ09OVEFJTkVSX05BTUU7XHJcbiAgLy9jb25zdCBsYW5nOiBMYW5ndWFnZSA9IHByb2Nlc3MuZW52LkxBTkcgPyAocHJvY2Vzcy5lbnYuTEFORyBhcyBMYW5ndWFnZSkgOiBcImVuXCI7XHJcbiAgLy9jb25zdCBzbGFja0FwcFRva2VuS2V5ID0gcHJvY2Vzcy5lbnYuU0xBQ0tfQVBQX1RPS0VOX0tFWSE7XHJcbiAgLy9jb25zdCBhcmNoaXRlY3R1cmVEZXNjcmlwdGlvbiA9IHByb2Nlc3MuZW52LkFSQ0hJVEVDVFVSRV9ERVNDUklQVElPTiE7XHJcblxyXG4gIC8vY29uc3QgdG9rZW4gPSBhd2FpdCBnZXRTZWNyZXQoc2xhY2tBcHBUb2tlbktleSk7XHJcbiAgLy9jb25zdCBtZXNzYWdlQ2xpZW50ID0gbmV3IE1lc3NhZ2VDbGllbnQodG9rZW4hLnRvU3RyaW5nKCksIGxhbmcpO1xyXG5cclxuICAvLyBDaGVjayByZXF1aXJlZCB2YXJpYWJsZXMuXHJcbiAgLy9pZiAoIW1vZGVsSWQgfHwgICFjaGFubmVsSWQgfHwgIXRocmVhZFRzKSB7XHJcbiAgLy8gIGxvZ2dlci5lcnJvcihgTm90IGZvdW5kIGFueSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuIFBsZWFzZSBjaGVjay5gLCB7ZW52aXJvbmVtbnRzOiB7bW9kZWxJZCwgY2hhbm5lbElkLCB0aHJlYWRUc319KTtcclxuICAgIC8qXHJcbiAgICBpZiAoY2hhbm5lbElkICYmIHRocmVhZFRzKSB7XHJcbiAgICAgIG1lc3NhZ2VDbGllbnQuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgbGFuZyAmJiBsYW5nID09PSBcImphXCJcclxuICAgICAgICAgID8gXCLjgqjjg6njg7zjgYznmbrnlJ/jgZfjgb7jgZfjgZ86IOeSsOWig+WkieaVsOOBjOioreWumuOBleOCjOOBpuOBhOOBquOBhOOAgeOBvuOBn+OBr+a4oeOBleOCjOOBpuOBhOOBquOBhOWPr+iDveaAp+OBjOOBguOCiuOBvuOBmeOAglwiXHJcbiAgICAgICAgICA6IFwiRXJyb3I6IE5vdCBmb3VuZCBhbnkgZW52aXJvbm1lbnQgdmFyaWFibGVzLlwiLFxyXG4gICAgICAgIGNoYW5uZWxJZCwgXHJcbiAgICAgICAgdGhyZWFkVHNcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgICovXHJcbiAgIC8qXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXM6IDQwMCwgXHJcbiAgICAgIGJvZHk6IFwiTWlzc2luZyBlbnZpcm9ubWVudCB2YXJpYWJsZXNcIlxyXG4gICAgfTtcclxuICAqL1xyXG4gIFxyXG5cclxuICB0cnkge1xyXG4gICAgLy8gUHJvY2VzcyB0byByZXRyaWV2ZSBmaWxlcyBmcm9tIEF6dXJlIFN0b3JhZ2UgQmxvYlxyXG4gICAgY29uc3Qgc3RvcmFnZUFjY291bnROYW1lIDogc3RyaW5nID0gcHJvY2Vzcy5lbnZbXCJTVE9SQUdFX0FDQ09VTlRfTkFNRVwiXSA/IHByb2Nlc3MuZW52W1wiU1RPUkFHRV9BQ0NPVU5UX05BTUVcIl0gOiBcIlwiO1xyXG4gICAgY29uc3QgY29udGFpbmVyTmFtZSA6IHN0cmluZyA9IHByb2Nlc3MuZW52W1wiQ09OVEFJTkVSX05BTUVcIl0gPyBwcm9jZXNzLmVudltcIkNPTlRBSU5FUl9OQU1FXCJdIDogXCJcIjtcclxuICAgIGNvbnN0IGF6dXJlU3RvcmFnZUJsb2JDbGllbnQgPSBuZXcgQXp1cmVTdG9yYWdlQmxvYkNsaWVudChsb2dnZXIsIHN0b3JhZ2VBY2NvdW50TmFtZSwgY29udGFpbmVyTmFtZSk7XHJcbiAgICBjb25zdCBibG9iRGF0YVJlY29yZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IGF3YWl0IGF6dXJlU3RvcmFnZUJsb2JDbGllbnQubG9hZEFsbEJsb2JzKCk7XHJcbiAgICBjb25zdCBibG9iRGF0YTogc3RyaW5nID0gT2JqZWN0LnZhbHVlcyhibG9iRGF0YVJlY29yZCkuam9pbihcIlxcblwiKTtcclxuICAgIGxvZ2dlci5pbmZvKFwicmV0cmlldmUgZmlsZXNcIiwge1wiYmxvYkRhdGFcIjogYmxvYkRhdGEgfSk7XHJcbiAgICBcclxuICAgIC8vIGdlbmVyYXRlIGEgcHJvbXB0XHJcbiAgICBjb25zdCBsYW5nOiBzdHJpbmcgPSBcImphXCI7XHJcbiAgICBjb25zdCBhcmNoaXRlY3R1cmVEZXNjcmlwdGlvbjogc3RyaW5nID0gXCJ0ZXN0XCI7XHJcbiAgICBjb25zdCBwcm9tcHQgPSBuZXcgUHJvbXB0KGxhbmcsIGFyY2hpdGVjdHVyZURlc2NyaXB0aW9uKS5jcmVhdGVMb2dBbmFseXNpc1Byb21wdCgpO1xyXG4gICAgbG9nZ2VyLmluZm8oXCJNYWRlIHByb21wdFwiLCB7cHJvbXB0OiBwcm9tcHR9KTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBhIHJlc3BvbnNlIHVzaW5nIHRoZSBMTE1cclxuICAgIGNvbnN0IGF6dXJlT3BlbkFJRW5kcG9pbnQ6IHN0cmluZyA9IHByb2Nlc3MuZW52W1wiQVpVUkVfT1BFTkFJX0VORFBPSU5UXCJdID8gcHJvY2Vzcy5lbnZbXCJBWlVSRV9PUEVOQUlfRU5EUE9JTlRcIl0gOiBcIlwiO1xyXG4gICAgY29uc3QgYXp1cmVPcGVuQUlLZXk6IHN0cmluZyA9IHByb2Nlc3MuZW52W1wiQVpVUkVfT1BFTkFJX0tFWVwiXSA/IHByb2Nlc3MuZW52W1wiQVpVUkVfT1BFTkFJX0tFWVwiXSA6IFwiXCI7XHJcbiAgICBjb25zdCBhenVyZU9wZW5BSUNsaWVudCA9IG5ldyBBenVyZU9wZW5BSUNsaWVudChhenVyZU9wZW5BSUVuZHBvaW50LCBhenVyZU9wZW5BSUtleSk7XHJcbiAgICBjb25zdCBzdW1tYXJ5ID0gYXdhaXQgYXp1cmVPcGVuQUlDbGllbnQuc3VtbWFyaXplKHByb21wdCwgYmxvYkRhdGEsIDEwMDAsIDIwMCk7XHJcbiAgICBsb2dnZXIuaW5mbyhcImdlbmVyYXRlIGFuc3dlclwiLCB7c3VtbWFyeTogc3VtbWFyeX0pO1xyXG4gICAgXHJcbiAgICBpZighc3VtbWFyeSkgdGhyb3cgbmV3IEVycm9yKFwiTm8gcmVzcG9uc2UgZnJvbSBMTE1cIik7XHJcblxyXG4gICAgLy8gV2UgYXNzdW1lIHRoYXQgdGhyZXNob2xkIGlzIDMsNTAwLiBBbmQgaXQncyBub3QgYWNjdXJhdGUuIFBsZWFzZSBtb2RpZnkgdGhpcyB2YWx1ZSB3aGVuIHlvdSBtZXQgZXJyb3IuIFxyXG4gICAgLy9pZihhbnN3ZXIubGVuZ3RoIDwgMzUwMCl7XHJcbiAgICAgIC8vIFNlbmQgdGhlIGFuc3dlciB0byBTbGFjayBkaXJlY3RseS5cclxuICAgICAgLypcclxuICAgICAgYXdhaXQgbWVzc2FnZUNsaWVudC5zZW5kTWVzc2FnZShcclxuICAgICAgICBtZXNzYWdlQ2xpZW50LmNyZWF0ZU1lc3NhZ2VCbG9jayhhbnN3ZXIpLFxyXG4gICAgICAgIGNoYW5uZWxJZCxcclxuICAgICAgICB0aHJlYWRUc1xyXG4gICAgICApO1xyXG4gICAgICAqL1xyXG4gICAgIC8vbG9nZ2VyLmluZm8oYW5zd2VyKTtcclxuICAgIC8vfWVsc2V7XHJcbiAgICAgIC8vIFNlbmQgdGhlIHNuaXBwZXQgb2YgYW5zd2VyIGluc3RlYWQgb2YgbWVzc2FnZSBkdWUgdG8gbGltaXRhdGlvbiBvZiBtZXNzYWdlIHNpemUuXHJcbiAgICAgIC8vYXdhaXQgbWVzc2FnZUNsaWVudC5zZW5kTWFya2Rvd25TbmlwcGV0KFwiYW5zd2VyLm1kXCIsIGFuc3dlciwgY2hhbm5lbElkLCB0aHJlYWRUcylcclxuICAgIC8vfVxyXG5cclxuICAgIC8vbG9nZ2VyLmluZm8oJ1N1Y2Nlc3MgdG8gZ2V0IGFuc3dlcjonLCBhbnN3ZXIpO1xyXG5cclxuXHJcbiAgICAvKiAqKioqKiogKi9cclxuXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGxvZ2dlci5lcnJvcihcIlNvbWV0aGluZyBoYXBwZW5lZFwiLCBlcnJvciBhcyBFcnJvcik7XHJcbiAgICAvLyBTZW5kIHRoZSBmb3JtIHRvIHJldHJ5IHdoZW4gZXJyb3Igd2FzIG9jY3VyZWQuXHJcbiAgICAvKlxyXG4gICAgaWYoY2hhbm5lbElkICYmIHRocmVhZFRzKXtcclxuICAgICAgYXdhaXQgbWVzc2FnZUNsaWVudC5zZW5kTWVzc2FnZShcclxuICAgICAgICBtZXNzYWdlQ2xpZW50LmNyZWF0ZUVycm9yTWVzc2FnZUJsb2NrKCksXHJcbiAgICAgICAgY2hhbm5lbElkLCBcclxuICAgICAgICB0aHJlYWRUc1xyXG4gICAgICApO1xyXG4gICAgICBhd2FpdCBtZXNzYWdlQ2xpZW50LnNlbmRNZXNzYWdlKCBcclxuICAgICAgICBtZXNzYWdlQ2xpZW50LmNyZWF0ZU1lc3NhZ2VCbG9jayhcclxuICAgICAgICAgIGxhbmcgPT09IFwiamFcIiBcclxuICAgICAgICAgICAgPyBcIuODquODiOODqeOCpOOBl+OBn+OBhOWgtOWQiOOBr+OAgeS7peS4i+OBruODleOCqeODvOODoOOBi+OCieOCguOBhuS4gOW6puWQjOOBmOWGheWuueOBruODquOCr+OCqOOCueODiOOCkumAgeOBo+OBpuOBj+OBoOOBleOBhOOAglwiIFxyXG4gICAgICAgICAgICA6IFwiSWYgeW91IHdhbnQgdG8gcmV0cnkgaXQsIHlvdSBzZW5kIHNhbWUgcmVxdWVzdCBhZ2FpbiBmcm9tIGJlbG93IGZvcm0uXCJcclxuICAgICAgICApLFxyXG4gICAgICAgIGNoYW5uZWxJZCwgXHJcbiAgICAgICAgdGhyZWFkVHNcclxuICAgICAgKTtcclxuICAgICAgY29uc3Qgbm93ID0gdG9ab25lZFRpbWUobmV3IERhdGUoKSwgXCJBc2lhL1Rva3lvXCIpO1xyXG4gICAgICBhd2FpdCBtZXNzYWdlQ2xpZW50LnNlbmRNZXNzYWdlKFxyXG4gICAgICAgIG1lc3NhZ2VDbGllbnQuY3JlYXRlRm9ybUJsb2NrKGZvcm1hdChub3csIFwieXl5eS1NTS1kZFwiKSwgZm9ybWF0KG5vdywgXCJISDptbVwiKSksXHJcbiAgICAgICAgY2hhbm5lbElkLFxyXG4gICAgICAgIHRocmVhZFRzXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgICovXHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0dXM6IDQwMCxcclxuICAgIGJvZHk6IFwiUHJvY2Vzc2VkXCJcclxuICB9O1xyXG59O1xyXG5cclxuYXBwLmh0dHAoJ2h0dHBUcmlnZ2VyJywge1xyXG4gIG1ldGhvZHM6IFsnR0VUJ10sXHJcbiAgYXV0aExldmVsOiAnYW5vbnltb3VzJyxcclxuICBoYW5kbGVyOiBodHRwVHJpZ2dlclxyXG59KTtcclxuIl19