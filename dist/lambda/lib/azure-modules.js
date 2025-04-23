"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This method is to transform from Rows type to CSV.
// Because Rows type makes prompt's context more big.
// So we need to decrease token size by transformation.
/*
function rowsToCSV(rows: Row[]) {
  return rows
    .map((row) => row.Data!.map((data) => data.VarCharValue).join(","))
    .join("\n");
}


// For X-Ray
export async function queryToXray(
  startDate: string,
  endDate: string,
  outputKey: string
) {
  logger.info("Start", {funciton: queryToXray.name, input: {startDate, endDate, outputKey}});
  const client = new XRayClient();
  const input = {
    StartTime: new Date(startDate),
    EndTime: new Date(endDate),
    TimeRangeType: TimeRangeType.Event
  };
  let command = new GetTraceSummariesCommand(input);
  let response = await client.send(command);
  const traces = response.TraceSummaries
    ? response.TraceSummaries
    : ([] as TraceSummary[]);

  while (response.NextToken) {
    command = new GetTraceSummariesCommand({
      ...input,
      NextToken: response.NextToken
    });
    response = await client.send(command);
    if (response.TraceSummaries) traces.push(...response.TraceSummaries);
  }

  logger.info("End", {funciton: queryToXray.name, output: {traces}});
  return { key: outputKey, value: traces };
}

export async function listGuardDutyFindings(detectorId: string, outputKey: string) {
  logger.info("Start", {funciton: listGuardDutyFindings.name, input: {detectorId, outputKey}});
  const guarddutyClient = new GuardDutyClient();

  let listFindingsCommandInput: ListFindingsCommandInput = {
    DetectorId: detectorId,
    FindingCriteria: {
      Criterion: {
        severity: {
          GreaterThanOrEqual: 4.0,
        },
      },
    },
  };
  let listFindingsCommand = new ListFindingsCommand(listFindingsCommandInput);
  let listFindingsResponse = await guarddutyClient.send(listFindingsCommand);
  const findingIds = listFindingsResponse.FindingIds
    ? listFindingsResponse.FindingIds
    : [];

  while (listFindingsResponse.NextToken) {
    listFindingsCommandInput = {
      ...listFindingsCommandInput,
      NextToken: listFindingsResponse.NextToken,
    };

    listFindingsCommand = new ListFindingsCommand(listFindingsCommandInput);
    listFindingsResponse = await guarddutyClient.send(listFindingsCommand);
    if (listFindingsResponse.FindingIds)
      findingIds.push(...listFindingsResponse.FindingIds);
  }

  const input: GetFindingsCommandInput = {
    DetectorId: detectorId,
    FindingIds: findingIds,
  };
  const getFindingsResponse = await guarddutyClient.send(new GetFindingsCommand(input));
  const findings = getFindingsResponse.Findings
    ? getFindingsResponse.Findings
    : [];

  logger.info("End", {funciton: listGuardDutyFindings.name, output: {numberOfFindings: findings.length, findings}});
  return { key: outputKey, value: findings };
}

export async function listSecurityHubFindings(outputKey: string) {
  logger.info("Start", {funciton: listSecurityHubFindings.name, input: {outputKey}});
  const securityHubClient = new SecurityHubClient();

  const getSecurityHubFindingsInput: GetSecurityHubFindingsCommandInput = {
    // Refer to configuration of Baseline Environment on AWS
    // https://github.com/aws-samples/baseline-environment-on-aws/blob/ef33275e8961f4305509eccfb7dc8338407dbc9f/usecases/blea-gov-base-ct/lib/construct/detection.ts#L334
    Filters: {
      SeverityLabel: [
        { Comparison: "EQUALS", Value: "CRITICAL" },
        { Comparison: "EQUALS", Value: "HIGH" },
      ],
      ComplianceStatus: [{ Comparison: "EQUALS", Value: "FAILED" }],
      WorkflowStatus: [
        { Comparison: "EQUALS", Value: "NEW" },
        { Comparison: "EQUALS", Value: "NOTIFIED" },
      ],
      RecordState: [{ Comparison: "EQUALS", Value: "ACTIVE" }],
    },
  };
  const getSecurityHubFindingsCommand = new GetSecurityHubFindingsCommand(
    getSecurityHubFindingsInput
  );

  const response = await securityHubClient.send(getSecurityHubFindingsCommand);
  logger.info("End", {funciton: listSecurityHubFindings.name, output: {numberOfFindings: response.Findings?.length, findings: response.Findings}});

  return { key: outputKey, value: response.Findings};
}

export async function converse(
  prompt: string,
  modelId: string = process.env.MODEL_ID!,
  inferenceConfig: InferenceConfiguration = {
    maxTokens: 2000,
    temperature: 0.1,
    topP: 0.97
  }
){
  logger.info("Start", {funciton: converse.name, input: {prompt, modelId, inferenceConfig}});
  const client = new BedrockRuntimeClient();
  const converseCommandInput :ConverseCommandInput = {
    modelId,
    messages: [
      {
        "role": "user",
        "content": [{"text": prompt}]
      }
    ],
    inferenceConfig,
  }
  try{
    const converseOutput = await client.send(new ConverseCommand(converseCommandInput));
    logger.info("End", {funciton: converse.name, output: {converseOutput}});
    return converseOutput.output?.message?.content![0].text;
  }catch(error){
    logger.error("Something happened", error as Error);
    return "";
  }
}

export async function invokeAsyncLambdaFunc(
  payload: string,
  functionName: string
) {
  logger.info("Start", {funciton: invokeAsyncLambdaFunc.name, input: {payload, functionName}});
  const lambdaClient = new LambdaClient();
  const input: InvokeCommandInputType = {
    FunctionName: functionName,
    InvocationType: "Event",
    Payload: payload
  };
  const invokeCommand = new InvokeCommand(input);
  logger.info("Send command", {command: invokeCommand});
  const res = await lambdaClient.send(invokeCommand);
  logger.info("End", {funciton: invokeAsyncLambdaFunc.name, output: {response: res}});
  return res;
}
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXp1cmUtbW9kdWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xhbWJkYS9saWIvYXp1cmUtbW9kdWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLHFEQUFxRDtBQUNyRCxxREFBcUQ7QUFDckQsdURBQXVEO0FBQ3ZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUtFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIHdyYXBwZXIgb2YgQXp1cmUgU0RLLlxyXG5pbXBvcnQge3NwbGl0fSBmcm9tICdsb2Rhc2gnO1xyXG5cclxuXHJcbi8vIFRoaXMgbWV0aG9kIGlzIHRvIHRyYW5zZm9ybSBmcm9tIFJvd3MgdHlwZSB0byBDU1YuXHJcbi8vIEJlY2F1c2UgUm93cyB0eXBlIG1ha2VzIHByb21wdCdzIGNvbnRleHQgbW9yZSBiaWcuXHJcbi8vIFNvIHdlIG5lZWQgdG8gZGVjcmVhc2UgdG9rZW4gc2l6ZSBieSB0cmFuc2Zvcm1hdGlvbi5cclxuLypcclxuZnVuY3Rpb24gcm93c1RvQ1NWKHJvd3M6IFJvd1tdKSB7XHJcbiAgcmV0dXJuIHJvd3NcclxuICAgIC5tYXAoKHJvdykgPT4gcm93LkRhdGEhLm1hcCgoZGF0YSkgPT4gZGF0YS5WYXJDaGFyVmFsdWUpLmpvaW4oXCIsXCIpKVxyXG4gICAgLmpvaW4oXCJcXG5cIik7XHJcbn1cclxuXHJcblxyXG4vLyBGb3IgWC1SYXlcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHF1ZXJ5VG9YcmF5KFxyXG4gIHN0YXJ0RGF0ZTogc3RyaW5nLFxyXG4gIGVuZERhdGU6IHN0cmluZyxcclxuICBvdXRwdXRLZXk6IHN0cmluZ1xyXG4pIHtcclxuICBsb2dnZXIuaW5mbyhcIlN0YXJ0XCIsIHtmdW5jaXRvbjogcXVlcnlUb1hyYXkubmFtZSwgaW5wdXQ6IHtzdGFydERhdGUsIGVuZERhdGUsIG91dHB1dEtleX19KTtcclxuICBjb25zdCBjbGllbnQgPSBuZXcgWFJheUNsaWVudCgpO1xyXG4gIGNvbnN0IGlucHV0ID0ge1xyXG4gICAgU3RhcnRUaW1lOiBuZXcgRGF0ZShzdGFydERhdGUpLFxyXG4gICAgRW5kVGltZTogbmV3IERhdGUoZW5kRGF0ZSksXHJcbiAgICBUaW1lUmFuZ2VUeXBlOiBUaW1lUmFuZ2VUeXBlLkV2ZW50XHJcbiAgfTtcclxuICBsZXQgY29tbWFuZCA9IG5ldyBHZXRUcmFjZVN1bW1hcmllc0NvbW1hbmQoaW5wdXQpO1xyXG4gIGxldCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKGNvbW1hbmQpO1xyXG4gIGNvbnN0IHRyYWNlcyA9IHJlc3BvbnNlLlRyYWNlU3VtbWFyaWVzXHJcbiAgICA/IHJlc3BvbnNlLlRyYWNlU3VtbWFyaWVzXHJcbiAgICA6IChbXSBhcyBUcmFjZVN1bW1hcnlbXSk7XHJcblxyXG4gIHdoaWxlIChyZXNwb25zZS5OZXh0VG9rZW4pIHtcclxuICAgIGNvbW1hbmQgPSBuZXcgR2V0VHJhY2VTdW1tYXJpZXNDb21tYW5kKHtcclxuICAgICAgLi4uaW5wdXQsXHJcbiAgICAgIE5leHRUb2tlbjogcmVzcG9uc2UuTmV4dFRva2VuXHJcbiAgICB9KTtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XHJcbiAgICBpZiAocmVzcG9uc2UuVHJhY2VTdW1tYXJpZXMpIHRyYWNlcy5wdXNoKC4uLnJlc3BvbnNlLlRyYWNlU3VtbWFyaWVzKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlci5pbmZvKFwiRW5kXCIsIHtmdW5jaXRvbjogcXVlcnlUb1hyYXkubmFtZSwgb3V0cHV0OiB7dHJhY2VzfX0pO1xyXG4gIHJldHVybiB7IGtleTogb3V0cHV0S2V5LCB2YWx1ZTogdHJhY2VzIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0R3VhcmREdXR5RmluZGluZ3MoZGV0ZWN0b3JJZDogc3RyaW5nLCBvdXRwdXRLZXk6IHN0cmluZykge1xyXG4gIGxvZ2dlci5pbmZvKFwiU3RhcnRcIiwge2Z1bmNpdG9uOiBsaXN0R3VhcmREdXR5RmluZGluZ3MubmFtZSwgaW5wdXQ6IHtkZXRlY3RvcklkLCBvdXRwdXRLZXl9fSk7XHJcbiAgY29uc3QgZ3VhcmRkdXR5Q2xpZW50ID0gbmV3IEd1YXJkRHV0eUNsaWVudCgpO1xyXG5cclxuICBsZXQgbGlzdEZpbmRpbmdzQ29tbWFuZElucHV0OiBMaXN0RmluZGluZ3NDb21tYW5kSW5wdXQgPSB7XHJcbiAgICBEZXRlY3RvcklkOiBkZXRlY3RvcklkLFxyXG4gICAgRmluZGluZ0NyaXRlcmlhOiB7XHJcbiAgICAgIENyaXRlcmlvbjoge1xyXG4gICAgICAgIHNldmVyaXR5OiB7XHJcbiAgICAgICAgICBHcmVhdGVyVGhhbk9yRXF1YWw6IDQuMCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG4gIGxldCBsaXN0RmluZGluZ3NDb21tYW5kID0gbmV3IExpc3RGaW5kaW5nc0NvbW1hbmQobGlzdEZpbmRpbmdzQ29tbWFuZElucHV0KTtcclxuICBsZXQgbGlzdEZpbmRpbmdzUmVzcG9uc2UgPSBhd2FpdCBndWFyZGR1dHlDbGllbnQuc2VuZChsaXN0RmluZGluZ3NDb21tYW5kKTtcclxuICBjb25zdCBmaW5kaW5nSWRzID0gbGlzdEZpbmRpbmdzUmVzcG9uc2UuRmluZGluZ0lkc1xyXG4gICAgPyBsaXN0RmluZGluZ3NSZXNwb25zZS5GaW5kaW5nSWRzXHJcbiAgICA6IFtdO1xyXG5cclxuICB3aGlsZSAobGlzdEZpbmRpbmdzUmVzcG9uc2UuTmV4dFRva2VuKSB7XHJcbiAgICBsaXN0RmluZGluZ3NDb21tYW5kSW5wdXQgPSB7XHJcbiAgICAgIC4uLmxpc3RGaW5kaW5nc0NvbW1hbmRJbnB1dCxcclxuICAgICAgTmV4dFRva2VuOiBsaXN0RmluZGluZ3NSZXNwb25zZS5OZXh0VG9rZW4sXHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RGaW5kaW5nc0NvbW1hbmQgPSBuZXcgTGlzdEZpbmRpbmdzQ29tbWFuZChsaXN0RmluZGluZ3NDb21tYW5kSW5wdXQpO1xyXG4gICAgbGlzdEZpbmRpbmdzUmVzcG9uc2UgPSBhd2FpdCBndWFyZGR1dHlDbGllbnQuc2VuZChsaXN0RmluZGluZ3NDb21tYW5kKTtcclxuICAgIGlmIChsaXN0RmluZGluZ3NSZXNwb25zZS5GaW5kaW5nSWRzKVxyXG4gICAgICBmaW5kaW5nSWRzLnB1c2goLi4ubGlzdEZpbmRpbmdzUmVzcG9uc2UuRmluZGluZ0lkcyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpbnB1dDogR2V0RmluZGluZ3NDb21tYW5kSW5wdXQgPSB7XHJcbiAgICBEZXRlY3RvcklkOiBkZXRlY3RvcklkLFxyXG4gICAgRmluZGluZ0lkczogZmluZGluZ0lkcyxcclxuICB9O1xyXG4gIGNvbnN0IGdldEZpbmRpbmdzUmVzcG9uc2UgPSBhd2FpdCBndWFyZGR1dHlDbGllbnQuc2VuZChuZXcgR2V0RmluZGluZ3NDb21tYW5kKGlucHV0KSk7XHJcbiAgY29uc3QgZmluZGluZ3MgPSBnZXRGaW5kaW5nc1Jlc3BvbnNlLkZpbmRpbmdzXHJcbiAgICA/IGdldEZpbmRpbmdzUmVzcG9uc2UuRmluZGluZ3NcclxuICAgIDogW107XHJcblxyXG4gIGxvZ2dlci5pbmZvKFwiRW5kXCIsIHtmdW5jaXRvbjogbGlzdEd1YXJkRHV0eUZpbmRpbmdzLm5hbWUsIG91dHB1dDoge251bWJlck9mRmluZGluZ3M6IGZpbmRpbmdzLmxlbmd0aCwgZmluZGluZ3N9fSk7XHJcbiAgcmV0dXJuIHsga2V5OiBvdXRwdXRLZXksIHZhbHVlOiBmaW5kaW5ncyB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzdFNlY3VyaXR5SHViRmluZGluZ3Mob3V0cHV0S2V5OiBzdHJpbmcpIHtcclxuICBsb2dnZXIuaW5mbyhcIlN0YXJ0XCIsIHtmdW5jaXRvbjogbGlzdFNlY3VyaXR5SHViRmluZGluZ3MubmFtZSwgaW5wdXQ6IHtvdXRwdXRLZXl9fSk7XHJcbiAgY29uc3Qgc2VjdXJpdHlIdWJDbGllbnQgPSBuZXcgU2VjdXJpdHlIdWJDbGllbnQoKTtcclxuXHJcbiAgY29uc3QgZ2V0U2VjdXJpdHlIdWJGaW5kaW5nc0lucHV0OiBHZXRTZWN1cml0eUh1YkZpbmRpbmdzQ29tbWFuZElucHV0ID0ge1xyXG4gICAgLy8gUmVmZXIgdG8gY29uZmlndXJhdGlvbiBvZiBCYXNlbGluZSBFbnZpcm9ubWVudCBvbiBBV1NcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3Mtc2FtcGxlcy9iYXNlbGluZS1lbnZpcm9ubWVudC1vbi1hd3MvYmxvYi9lZjMzMjc1ZTg5NjFmNDMwNTUwOWVjY2ZiN2RjODMzODQwN2RiYzlmL3VzZWNhc2VzL2JsZWEtZ292LWJhc2UtY3QvbGliL2NvbnN0cnVjdC9kZXRlY3Rpb24udHMjTDMzNFxyXG4gICAgRmlsdGVyczoge1xyXG4gICAgICBTZXZlcml0eUxhYmVsOiBbXHJcbiAgICAgICAgeyBDb21wYXJpc29uOiBcIkVRVUFMU1wiLCBWYWx1ZTogXCJDUklUSUNBTFwiIH0sXHJcbiAgICAgICAgeyBDb21wYXJpc29uOiBcIkVRVUFMU1wiLCBWYWx1ZTogXCJISUdIXCIgfSxcclxuICAgICAgXSxcclxuICAgICAgQ29tcGxpYW5jZVN0YXR1czogW3sgQ29tcGFyaXNvbjogXCJFUVVBTFNcIiwgVmFsdWU6IFwiRkFJTEVEXCIgfV0sXHJcbiAgICAgIFdvcmtmbG93U3RhdHVzOiBbXHJcbiAgICAgICAgeyBDb21wYXJpc29uOiBcIkVRVUFMU1wiLCBWYWx1ZTogXCJORVdcIiB9LFxyXG4gICAgICAgIHsgQ29tcGFyaXNvbjogXCJFUVVBTFNcIiwgVmFsdWU6IFwiTk9USUZJRURcIiB9LFxyXG4gICAgICBdLFxyXG4gICAgICBSZWNvcmRTdGF0ZTogW3sgQ29tcGFyaXNvbjogXCJFUVVBTFNcIiwgVmFsdWU6IFwiQUNUSVZFXCIgfV0sXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgY29uc3QgZ2V0U2VjdXJpdHlIdWJGaW5kaW5nc0NvbW1hbmQgPSBuZXcgR2V0U2VjdXJpdHlIdWJGaW5kaW5nc0NvbW1hbmQoXHJcbiAgICBnZXRTZWN1cml0eUh1YkZpbmRpbmdzSW5wdXRcclxuICApO1xyXG5cclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlY3VyaXR5SHViQ2xpZW50LnNlbmQoZ2V0U2VjdXJpdHlIdWJGaW5kaW5nc0NvbW1hbmQpO1xyXG4gIGxvZ2dlci5pbmZvKFwiRW5kXCIsIHtmdW5jaXRvbjogbGlzdFNlY3VyaXR5SHViRmluZGluZ3MubmFtZSwgb3V0cHV0OiB7bnVtYmVyT2ZGaW5kaW5nczogcmVzcG9uc2UuRmluZGluZ3M/Lmxlbmd0aCwgZmluZGluZ3M6IHJlc3BvbnNlLkZpbmRpbmdzfX0pO1xyXG5cclxuICByZXR1cm4geyBrZXk6IG91dHB1dEtleSwgdmFsdWU6IHJlc3BvbnNlLkZpbmRpbmdzfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbnZlcnNlKFxyXG4gIHByb21wdDogc3RyaW5nLCBcclxuICBtb2RlbElkOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5NT0RFTF9JRCEsXHJcbiAgaW5mZXJlbmNlQ29uZmlnOiBJbmZlcmVuY2VDb25maWd1cmF0aW9uID0ge1xyXG4gICAgbWF4VG9rZW5zOiAyMDAwLFxyXG4gICAgdGVtcGVyYXR1cmU6IDAuMSxcclxuICAgIHRvcFA6IDAuOTdcclxuICB9XHJcbil7XHJcbiAgbG9nZ2VyLmluZm8oXCJTdGFydFwiLCB7ZnVuY2l0b246IGNvbnZlcnNlLm5hbWUsIGlucHV0OiB7cHJvbXB0LCBtb2RlbElkLCBpbmZlcmVuY2VDb25maWd9fSk7XHJcbiAgY29uc3QgY2xpZW50ID0gbmV3IEJlZHJvY2tSdW50aW1lQ2xpZW50KCk7XHJcbiAgY29uc3QgY29udmVyc2VDb21tYW5kSW5wdXQgOkNvbnZlcnNlQ29tbWFuZElucHV0ID0ge1xyXG4gICAgbW9kZWxJZCxcclxuICAgIG1lc3NhZ2VzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBcInJvbGVcIjogXCJ1c2VyXCIsXHJcbiAgICAgICAgXCJjb250ZW50XCI6IFt7XCJ0ZXh0XCI6IHByb21wdH1dXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpbmZlcmVuY2VDb25maWcsXHJcbiAgfVxyXG4gIHRyeXtcclxuICAgIGNvbnN0IGNvbnZlcnNlT3V0cHV0ID0gYXdhaXQgY2xpZW50LnNlbmQobmV3IENvbnZlcnNlQ29tbWFuZChjb252ZXJzZUNvbW1hbmRJbnB1dCkpO1xyXG4gICAgbG9nZ2VyLmluZm8oXCJFbmRcIiwge2Z1bmNpdG9uOiBjb252ZXJzZS5uYW1lLCBvdXRwdXQ6IHtjb252ZXJzZU91dHB1dH19KTtcclxuICAgIHJldHVybiBjb252ZXJzZU91dHB1dC5vdXRwdXQ/Lm1lc3NhZ2U/LmNvbnRlbnQhWzBdLnRleHQ7XHJcbiAgfWNhdGNoKGVycm9yKXtcclxuICAgIGxvZ2dlci5lcnJvcihcIlNvbWV0aGluZyBoYXBwZW5lZFwiLCBlcnJvciBhcyBFcnJvcik7XHJcbiAgICByZXR1cm4gXCJcIjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnZva2VBc3luY0xhbWJkYUZ1bmMoXHJcbiAgcGF5bG9hZDogc3RyaW5nLFxyXG4gIGZ1bmN0aW9uTmFtZTogc3RyaW5nXHJcbikge1xyXG4gIGxvZ2dlci5pbmZvKFwiU3RhcnRcIiwge2Z1bmNpdG9uOiBpbnZva2VBc3luY0xhbWJkYUZ1bmMubmFtZSwgaW5wdXQ6IHtwYXlsb2FkLCBmdW5jdGlvbk5hbWV9fSk7XHJcbiAgY29uc3QgbGFtYmRhQ2xpZW50ID0gbmV3IExhbWJkYUNsaWVudCgpO1xyXG4gIGNvbnN0IGlucHV0OiBJbnZva2VDb21tYW5kSW5wdXRUeXBlID0ge1xyXG4gICAgRnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXHJcbiAgICBJbnZvY2F0aW9uVHlwZTogXCJFdmVudFwiLFxyXG4gICAgUGF5bG9hZDogcGF5bG9hZFxyXG4gIH07XHJcbiAgY29uc3QgaW52b2tlQ29tbWFuZCA9IG5ldyBJbnZva2VDb21tYW5kKGlucHV0KTtcclxuICBsb2dnZXIuaW5mbyhcIlNlbmQgY29tbWFuZFwiLCB7Y29tbWFuZDogaW52b2tlQ29tbWFuZH0pO1xyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGxhbWJkYUNsaWVudC5zZW5kKGludm9rZUNvbW1hbmQpO1xyXG4gIGxvZ2dlci5pbmZvKFwiRW5kXCIsIHtmdW5jaXRvbjogaW52b2tlQXN5bmNMYW1iZGFGdW5jLm5hbWUsIG91dHB1dDoge3Jlc3BvbnNlOiByZXN9fSk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG4qLyJdfQ==