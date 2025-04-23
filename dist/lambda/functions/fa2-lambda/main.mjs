"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpTrigger = void 0;
const functions_1 = require("@azure/functions");
const prompts_js_1 = require("../../lib/prompts.js");
const logger_js_1 = require("../../lib/logger.js");
const azure_storage_blob_client_js_1 = require("../../lib/azure-storage-blob-client.js");
const azure_openai_client_js_1 = require("../../lib/azure-openai-client.js");
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
        const storageAccountName = "jcomprojectloganaly94e9";
        const containerName = "loganalysis-dev-je-blob-001";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9sYW1iZGEvZnVuY3Rpb25zL2ZhMi1sYW1iZGEvbWFpbi5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQXlGO0FBQ3pGLHFEQUE4QztBQUM5QyxtREFBNkM7QUFDN0MseUZBQWdGO0FBQ2hGLDZFQUFxRTtBQVk5RCxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQWdCLEVBQUUsT0FBMEI7SUFFNUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBTSxDQUFDLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0lBRXBFLE1BQU0sT0FBTyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBaUIsQ0FBQztJQUNoRCxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFeEMsd0JBQXdCO0lBQ3hCLDhEQUE4RDtJQUM5RCxtREFBbUQ7SUFDbkQsa0ZBQWtGO0lBQ2xGLDREQUE0RDtJQUM1RCx3RUFBd0U7SUFFeEUsa0RBQWtEO0lBQ2xELG1FQUFtRTtJQUVuRSw0QkFBNEI7SUFDNUIsNkNBQTZDO0lBQzdDLHVIQUF1SDtJQUNySDs7Ozs7Ozs7OztNQVVFO0lBQ0g7Ozs7O0tBS0M7SUFHRixJQUFJLENBQUM7UUFDSCxvREFBb0Q7UUFDcEQsTUFBTSxrQkFBa0IsR0FBRyx5QkFBeUIsQ0FBQztRQUNyRCxNQUFNLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQztRQUNwRCxNQUFNLHNCQUFzQixHQUFHLElBQUkscURBQXNCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JHLE1BQU0sY0FBYyxHQUEyQixNQUFNLHNCQUFzQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNGLE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUV2RCxvQkFBb0I7UUFDcEIsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO1FBQzFCLE1BQU0sdUJBQXVCLEdBQVcsTUFBTSxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQU0sQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFN0Msb0NBQW9DO1FBQ3BDLE1BQU0sbUJBQW1CLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNySCxNQUFNLGNBQWMsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RHLE1BQU0saUJBQWlCLEdBQUcsSUFBSSwwQ0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRixNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFFbkQsSUFBRyxDQUFDLE9BQU87WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFckQsMEdBQTBHO1FBQzFHLDJCQUEyQjtRQUN6QixxQ0FBcUM7UUFDckM7Ozs7OztVQU1FO1FBQ0gsc0JBQXNCO1FBQ3ZCLFFBQVE7UUFDTixtRkFBbUY7UUFDbkYsbUZBQW1GO1FBQ3JGLEdBQUc7UUFFSCxnREFBZ0Q7UUFHaEQsWUFBWTtJQUVkLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxLQUFjLENBQUMsQ0FBQztRQUNuRCxpREFBaUQ7UUFDakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBdUJFO0lBQ0osQ0FBQztJQUNELE9BQU87UUFDTCxNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxXQUFXO0tBQ2xCLENBQUM7QUFDSixDQUFDO0FBckhELGtDQXFIQztBQUFBLENBQUM7QUFFRixlQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUN0QixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDaEIsU0FBUyxFQUFFLFdBQVc7SUFDdEIsT0FBTyxFQUFFLFdBQVc7Q0FDckIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXBwLCBIdHRwUmVxdWVzdCwgSHR0cFJlc3BvbnNlSW5pdCwgSW52b2NhdGlvbkNvbnRleHQgfSBmcm9tIFwiQGF6dXJlL2Z1bmN0aW9uc1wiO1xyXG5pbXBvcnQgeyBQcm9tcHQgfSBmcm9tIFwiLi4vLi4vbGliL3Byb21wdHMuanNcIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uLy4uL2xpYi9sb2dnZXIuanNcIjsgXHJcbmltcG9ydCB7IEF6dXJlU3RvcmFnZUJsb2JDbGllbnQgfSBmcm9tIFwiLi4vLi4vbGliL2F6dXJlLXN0b3JhZ2UtYmxvYi1jbGllbnQuanNcIjtcclxuaW1wb3J0IHsgQXp1cmVPcGVuQUlDbGllbnQgfSBmcm9tIFwiLi4vLi4vbGliL2F6dXJlLW9wZW5haS1jbGllbnQuanNcIjtcclxuaW1wb3J0IHsgQXp1cmVDbGlDcmVkZW50aWFsIH0gZnJvbSBcIkBhenVyZS9pZGVudGl0eS9kaXN0L2VzbS9pbmRleC5qc1wiO1xyXG5cclxuXHJcbnR5cGUgUmVxdWVzdEJvYnkgPSB7XHJcbiAgZXJyb3JEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHN0YXJ0RGF0ZTogc3RyaW5nO1xyXG4gIGVuZERhdGU6IHN0cmluZztcclxuICBjaGFubmVsSWQ6IHN0cmluZztcclxuICB0aHJlYWRUczogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaHR0cFRyaWdnZXIocmVxOiBIdHRwUmVxdWVzdCwgY29udGV4dDogSW52b2NhdGlvbkNvbnRleHQpOiBQcm9taXNlPEh0dHBSZXNwb25zZUluaXQ+IHtcclxuXHJcbiAgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcihjb250ZXh0LCBcIkF6dXJlRmFpbHVyZUFuYWx5c2lzQXNzaXN0YW50XCIpO1xyXG4gXHJcbiAgY29uc3QgcmVxQm9keSA9IGF3YWl0IHJlcS5qc29uKCkgYXMgUmVxdWVzdEJvYnk7XHJcbiAgY29uc3QgeyBlcnJvckRlc2NyaXB0aW9uLCBzdGFydERhdGUsIGVuZERhdGUsIGNoYW5uZWxJZCwgdGhyZWFkVHMgfSA9IHJlcUJvZHk7XHJcbiAgbG9nZ2VyLmluZm8oXCJSZXF1ZXN0IHN0YXJ0ZWRcIiwgcmVxQm9keSk7XHJcblxyXG4gIC8vIEVudmlyb25tZW50IHZhcmlhYmxlc1xyXG4gIC8vY29uc3Qgc3RvcmFnZUFjY291bnROYW1lID0gcHJvY2Vzcy5lbnYuU1RPUkFHRV9BQ0NPVU5UX05BTUU7XHJcbiAgLy9jb25zdCBjb250YWluZXJOYW1lID0gcHJvY2Vzcy5lbnYuQ09OVEFJTkVSX05BTUU7XHJcbiAgLy9jb25zdCBsYW5nOiBMYW5ndWFnZSA9IHByb2Nlc3MuZW52LkxBTkcgPyAocHJvY2Vzcy5lbnYuTEFORyBhcyBMYW5ndWFnZSkgOiBcImVuXCI7XHJcbiAgLy9jb25zdCBzbGFja0FwcFRva2VuS2V5ID0gcHJvY2Vzcy5lbnYuU0xBQ0tfQVBQX1RPS0VOX0tFWSE7XHJcbiAgLy9jb25zdCBhcmNoaXRlY3R1cmVEZXNjcmlwdGlvbiA9IHByb2Nlc3MuZW52LkFSQ0hJVEVDVFVSRV9ERVNDUklQVElPTiE7XHJcblxyXG4gIC8vY29uc3QgdG9rZW4gPSBhd2FpdCBnZXRTZWNyZXQoc2xhY2tBcHBUb2tlbktleSk7XHJcbiAgLy9jb25zdCBtZXNzYWdlQ2xpZW50ID0gbmV3IE1lc3NhZ2VDbGllbnQodG9rZW4hLnRvU3RyaW5nKCksIGxhbmcpO1xyXG5cclxuICAvLyBDaGVjayByZXF1aXJlZCB2YXJpYWJsZXMuXHJcbiAgLy9pZiAoIW1vZGVsSWQgfHwgICFjaGFubmVsSWQgfHwgIXRocmVhZFRzKSB7XHJcbiAgLy8gIGxvZ2dlci5lcnJvcihgTm90IGZvdW5kIGFueSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuIFBsZWFzZSBjaGVjay5gLCB7ZW52aXJvbmVtbnRzOiB7bW9kZWxJZCwgY2hhbm5lbElkLCB0aHJlYWRUc319KTtcclxuICAgIC8qXHJcbiAgICBpZiAoY2hhbm5lbElkICYmIHRocmVhZFRzKSB7XHJcbiAgICAgIG1lc3NhZ2VDbGllbnQuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgbGFuZyAmJiBsYW5nID09PSBcImphXCJcclxuICAgICAgICAgID8gXCLjgqjjg6njg7zjgYznmbrnlJ/jgZfjgb7jgZfjgZ86IOeSsOWig+WkieaVsOOBjOioreWumuOBleOCjOOBpuOBhOOBquOBhOOAgeOBvuOBn+OBr+a4oeOBleOCjOOBpuOBhOOBquOBhOWPr+iDveaAp+OBjOOBguOCiuOBvuOBmeOAglwiXHJcbiAgICAgICAgICA6IFwiRXJyb3I6IE5vdCBmb3VuZCBhbnkgZW52aXJvbm1lbnQgdmFyaWFibGVzLlwiLFxyXG4gICAgICAgIGNoYW5uZWxJZCwgXHJcbiAgICAgICAgdGhyZWFkVHNcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgICovXHJcbiAgIC8qXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXM6IDQwMCwgXHJcbiAgICAgIGJvZHk6IFwiTWlzc2luZyBlbnZpcm9ubWVudCB2YXJpYWJsZXNcIlxyXG4gICAgfTtcclxuICAqL1xyXG4gIFxyXG5cclxuICB0cnkge1xyXG4gICAgLy8gUHJvY2VzcyB0byByZXRyaWV2ZSBmaWxlcyBmcm9tIEF6dXJlIFN0b3JhZ2UgQmxvYlxyXG4gICAgY29uc3Qgc3RvcmFnZUFjY291bnROYW1lID0gXCJqY29tcHJvamVjdGxvZ2FuYWx5OTRlOVwiO1xyXG4gICAgY29uc3QgY29udGFpbmVyTmFtZSA9IFwibG9nYW5hbHlzaXMtZGV2LWplLWJsb2ItMDAxXCI7XHJcbiAgICBjb25zdCBhenVyZVN0b3JhZ2VCbG9iQ2xpZW50ID0gbmV3IEF6dXJlU3RvcmFnZUJsb2JDbGllbnQobG9nZ2VyLCBzdG9yYWdlQWNjb3VudE5hbWUsIGNvbnRhaW5lck5hbWUpO1xyXG4gICAgY29uc3QgYmxvYkRhdGFSZWNvcmQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSBhd2FpdCBhenVyZVN0b3JhZ2VCbG9iQ2xpZW50LmxvYWRBbGxCbG9icygpO1xyXG4gICAgY29uc3QgYmxvYkRhdGE6IHN0cmluZyA9IE9iamVjdC52YWx1ZXMoYmxvYkRhdGFSZWNvcmQpLmpvaW4oXCJcXG5cIik7XHJcbiAgICBsb2dnZXIuaW5mbyhcInJldHJpZXZlIGZpbGVzXCIsIHtcImJsb2JEYXRhXCI6IGJsb2JEYXRhIH0pO1xyXG4gICAgXHJcbiAgICAvLyBnZW5lcmF0ZSBhIHByb21wdFxyXG4gICAgY29uc3QgbGFuZzogc3RyaW5nID0gXCJqYVwiO1xyXG4gICAgY29uc3QgYXJjaGl0ZWN0dXJlRGVzY3JpcHRpb246IHN0cmluZyA9IFwidGVzdFwiO1xyXG4gICAgY29uc3QgcHJvbXB0ID0gbmV3IFByb21wdChsYW5nLCBhcmNoaXRlY3R1cmVEZXNjcmlwdGlvbikuY3JlYXRlTG9nQW5hbHlzaXNQcm9tcHQoKTtcclxuICAgIGxvZ2dlci5pbmZvKFwiTWFkZSBwcm9tcHRcIiwge3Byb21wdDogcHJvbXB0fSk7XHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgYSByZXNwb25zZSB1c2luZyB0aGUgTExNXHJcbiAgICBjb25zdCBhenVyZU9wZW5BSUVuZHBvaW50OiBzdHJpbmcgPSBwcm9jZXNzLmVudltcIkFaVVJFX09QRU5BSV9FTkRQT0lOVFwiXSA/IHByb2Nlc3MuZW52W1wiQVpVUkVfT1BFTkFJX0VORFBPSU5UXCJdIDogXCJcIjtcclxuICAgIGNvbnN0IGF6dXJlT3BlbkFJS2V5OiBzdHJpbmcgPSBwcm9jZXNzLmVudltcIkFaVVJFX09QRU5BSV9LRVlcIl0gPyBwcm9jZXNzLmVudltcIkFaVVJFX09QRU5BSV9LRVlcIl0gOiBcIlwiO1xyXG4gICAgY29uc3QgYXp1cmVPcGVuQUlDbGllbnQgPSBuZXcgQXp1cmVPcGVuQUlDbGllbnQoYXp1cmVPcGVuQUlFbmRwb2ludCwgYXp1cmVPcGVuQUlLZXkpO1xyXG4gICAgY29uc3Qgc3VtbWFyeSA9IGF3YWl0IGF6dXJlT3BlbkFJQ2xpZW50LnN1bW1hcml6ZShwcm9tcHQsIGJsb2JEYXRhLCAxMDAwLCAyMDApO1xyXG4gICAgbG9nZ2VyLmluZm8oXCJnZW5lcmF0ZSBhbnN3ZXJcIiwge3N1bW1hcnk6IHN1bW1hcnl9KTtcclxuICAgIFxyXG4gICAgaWYoIXN1bW1hcnkpIHRocm93IG5ldyBFcnJvcihcIk5vIHJlc3BvbnNlIGZyb20gTExNXCIpO1xyXG5cclxuICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRocmVzaG9sZCBpcyAzLDUwMC4gQW5kIGl0J3Mgbm90IGFjY3VyYXRlLiBQbGVhc2UgbW9kaWZ5IHRoaXMgdmFsdWUgd2hlbiB5b3UgbWV0IGVycm9yLiBcclxuICAgIC8vaWYoYW5zd2VyLmxlbmd0aCA8IDM1MDApe1xyXG4gICAgICAvLyBTZW5kIHRoZSBhbnN3ZXIgdG8gU2xhY2sgZGlyZWN0bHkuXHJcbiAgICAgIC8qXHJcbiAgICAgIGF3YWl0IG1lc3NhZ2VDbGllbnQuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgbWVzc2FnZUNsaWVudC5jcmVhdGVNZXNzYWdlQmxvY2soYW5zd2VyKSxcclxuICAgICAgICBjaGFubmVsSWQsXHJcbiAgICAgICAgdGhyZWFkVHNcclxuICAgICAgKTtcclxuICAgICAgKi9cclxuICAgICAvL2xvZ2dlci5pbmZvKGFuc3dlcik7XHJcbiAgICAvL31lbHNle1xyXG4gICAgICAvLyBTZW5kIHRoZSBzbmlwcGV0IG9mIGFuc3dlciBpbnN0ZWFkIG9mIG1lc3NhZ2UgZHVlIHRvIGxpbWl0YXRpb24gb2YgbWVzc2FnZSBzaXplLlxyXG4gICAgICAvL2F3YWl0IG1lc3NhZ2VDbGllbnQuc2VuZE1hcmtkb3duU25pcHBldChcImFuc3dlci5tZFwiLCBhbnN3ZXIsIGNoYW5uZWxJZCwgdGhyZWFkVHMpXHJcbiAgICAvL31cclxuXHJcbiAgICAvL2xvZ2dlci5pbmZvKCdTdWNjZXNzIHRvIGdldCBhbnN3ZXI6JywgYW5zd2VyKTtcclxuXHJcblxyXG4gICAgLyogKioqKioqICovXHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBsb2dnZXIuZXJyb3IoXCJTb21ldGhpbmcgaGFwcGVuZWRcIiwgZXJyb3IgYXMgRXJyb3IpO1xyXG4gICAgLy8gU2VuZCB0aGUgZm9ybSB0byByZXRyeSB3aGVuIGVycm9yIHdhcyBvY2N1cmVkLlxyXG4gICAgLypcclxuICAgIGlmKGNoYW5uZWxJZCAmJiB0aHJlYWRUcyl7XHJcbiAgICAgIGF3YWl0IG1lc3NhZ2VDbGllbnQuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgbWVzc2FnZUNsaWVudC5jcmVhdGVFcnJvck1lc3NhZ2VCbG9jaygpLFxyXG4gICAgICAgIGNoYW5uZWxJZCwgXHJcbiAgICAgICAgdGhyZWFkVHNcclxuICAgICAgKTtcclxuICAgICAgYXdhaXQgbWVzc2FnZUNsaWVudC5zZW5kTWVzc2FnZSggXHJcbiAgICAgICAgbWVzc2FnZUNsaWVudC5jcmVhdGVNZXNzYWdlQmxvY2soXHJcbiAgICAgICAgICBsYW5nID09PSBcImphXCIgXHJcbiAgICAgICAgICAgID8gXCLjg6rjg4jjg6njgqTjgZfjgZ/jgYTloLTlkIjjga/jgIHku6XkuIvjga7jg5Xjgqnjg7zjg6DjgYvjgonjgoLjgYbkuIDluqblkIzjgZjlhoXlrrnjga7jg6rjgq/jgqjjgrnjg4jjgpLpgIHjgaPjgabjgY/jgaDjgZXjgYTjgIJcIiBcclxuICAgICAgICAgICAgOiBcIklmIHlvdSB3YW50IHRvIHJldHJ5IGl0LCB5b3Ugc2VuZCBzYW1lIHJlcXVlc3QgYWdhaW4gZnJvbSBiZWxvdyBmb3JtLlwiXHJcbiAgICAgICAgKSxcclxuICAgICAgICBjaGFubmVsSWQsIFxyXG4gICAgICAgIHRocmVhZFRzXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IG5vdyA9IHRvWm9uZWRUaW1lKG5ldyBEYXRlKCksIFwiQXNpYS9Ub2t5b1wiKTtcclxuICAgICAgYXdhaXQgbWVzc2FnZUNsaWVudC5zZW5kTWVzc2FnZShcclxuICAgICAgICBtZXNzYWdlQ2xpZW50LmNyZWF0ZUZvcm1CbG9jayhmb3JtYXQobm93LCBcInl5eXktTU0tZGRcIiksIGZvcm1hdChub3csIFwiSEg6bW1cIikpLFxyXG4gICAgICAgIGNoYW5uZWxJZCxcclxuICAgICAgICB0aHJlYWRUc1xyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICAqL1xyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdHVzOiA0MDAsXHJcbiAgICBib2R5OiBcIlByb2Nlc3NlZFwiXHJcbiAgfTtcclxufTtcclxuXHJcbmFwcC5odHRwKCdodHRwVHJpZ2dlcicsIHtcclxuICBtZXRob2RzOiBbJ0dFVCddLFxyXG4gIGF1dGhMZXZlbDogJ2Fub255bW91cycsXHJcbiAgaGFuZGxlcjogaHR0cFRyaWdnZXJcclxufSk7XHJcbiJdfQ==