"use strict";
/*
import { format, parse } from "date-fns";
import { KnownBlock, View } from "@slack/types";
import { WebClient } from "@slack/web-api";
import logger from "./logger.js";
import { Language } from "../../parameter.js";

function convertDateFormat(dateString: string): string {
  // Parse dateString from specific format
  const parsedDate = parse(
    dateString,
    "EEE, dd MMM yyyy HH:mm:ss 'UTC'",
    new Date(),
  );

  // Modify format.
  const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");

  return formattedDate;
};

export class MessageClient {
  slackClient: WebClient;
  language: Language;
  constructor(
    token: string,
    language: Language = "en",
  ){
    this.slackClient = new WebClient(token);
    this.language = language;
  }
  
  // It's an explanation to avoid the hallucination that may include in llm's answer.
  public createHowToGetLogs(
    startDate: string,
    endDate: string,
    logGroups: string[],
    cwLogsQuery: string,
    cwMetricQuery: string,
    xrayTraces: boolean,
    albQuery?: string,
    trailQuery?: string,
  ) {
    let howToGetLogs: string;

    if(this.language === "ja"){
      howToGetLogs =
`
# ログやメトリクス、トレースの取得手順

参考にしたログは、それぞれ以下の手順とクエリで取得可能です。\n

## CloudWatch Logs

CloudWatch Logs Insightのコンソールにて、対象ロググループを指定し、時間範囲を \`${startDate}\` から \`${endDate}\` と設定した上で、クエリを実行してください。\n

### 対象ロググループ

\`\`\`${logGroups.join(", ")}\`\`\`

### クエリ

\`\`\`${cwLogsQuery}\`\`\`

`;

  howToGetLogs += albQuery
    ?
`## ALB

Athenaのコンソールで、 \`${process.env.ATHENA_DATABASE_NAME}\` のデータベースに対し、クエリを実行してください。\n

### クエリ

\`\`\`${albQuery} \`\`\`

`
    : "";

  howToGetLogs += trailQuery
    ?
`## CloudTrail

Athenaのコンソールで、 \`${process.env.ATHENA_DATABASE_NAME}\` のデータベースに対し、クエリを実行してください。

### クエリ

\`\`\`${trailQuery}\`\`\`

    `
        : "";

      howToGetLogs += `
## CloudWatchのメトリクス

次のクエリをローカル環境にJSON形式で保存し、CLIでコマンドを実行してください。

### クエリ

\`\`\`${cwMetricQuery}\`\`\`

### コマンド

\`\`\`aws cloudwatch get-metric-data --metric-data-queries file://{path-to-file/name-you-saved.json} --start-time ${startDate} --end-time ${endDate} --profile {your-profile-name} \`\`\`

`

      howToGetLogs += xrayTraces
        ? `
## X-rayのトレース情報

X-rayのコンソールで、時間範囲を \`${startDate}\` から \`${endDate}\` に指定してください。`
        : "";
    }else{
      howToGetLogs = `
# How to Get..

You can get the logs that LLM refered followed ways.

## CloudWatch Logs

CloudWatch Logs Insight Console, you choose target log groups and set time range like from \`${startDate}\` to \`${endDate}\`. Finally, you run query as below:\n

### Target log groups

\`\`\`${logGroups.join(", ")}\`\`\`

### Query

\`\`\`${cwLogsQuery}\`\`\`
`;

      howToGetLogs += albQuery
        ? `
## ALB

In Athena's management console, You run the query to \`${process.env.ATHENA_DATABASE_NAME}\` database.\n

### Query

\`\`\`${albQuery} \`\`\`

`
        : "";

      howToGetLogs += trailQuery
        ? `
## CloudTrail

In Athena's management console, You run the query to \`${process.env.ATHENA_DATABASE_NAME}\` database.\n

### Query

\`\`\`${trailQuery}\`\`\`

`
        : "";

      howToGetLogs += `
## CloudWatch Metrics

You should save below query as JSON file to your local environment and run the command.

### Query

\`\`\`${JSON.stringify(cwMetricQuery)}\`\`\`
  
### Command

\`\`\`aws cloudwatch get-metric-data --metric-data-queries file://{path-to-file/name-you-saved.json} --start-time ${startDate} --end-time ${endDate} --profile {your-profile-name} \`\`\`

`

      howToGetLogs += xrayTraces
        ? `
## X-ray Traces

X-ray's management console, please set data range like from \`${startDate}\` to \`${endDate}\` .`
        : "";

      }

    return howToGetLogs;
  }

  // Message template by Slack Block Kit
  public createFormBlock(date: string, time: string): KnownBlock[] {
    if(this.language === "ja"){
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "アラームが発生したようです。エラーの原因分析をしたい場合は、ログ検索を行う時刻の範囲を以下のフォームから入力してください。アラームのDatapointを参考に入力いただくと、比較的良い結果が得られやすいです。",
          },
        },
        {
          type: "divider",
        },
        {
          type: "input",
          block_id: "error_description",
          element: {
            type: "plain_text_input",
            action_id: "error_description",
            placeholder: {
              type: "plain_text",
              text: "例：外形監視のアラームで、エラー回数が規定以上になっています。",
            },
          },
          label: {
            type: "plain_text",
            text: "エラーの通知（アラーム）の内容",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "start_date",
          element: {
            type: "datepicker",
            initial_date: date,
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "start_date",
          },
          label: {
            type: "plain_text",
            text: "ログ取得の開始日",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "start_time",
          element: {
            type: "timepicker",
            initial_time: time,
            placeholder: {
              type: "plain_text",
              text: "Select time",
              emoji: true,
            },
            action_id: "start_time",
          },
          label: {
            type: "plain_text",
            text: "ログ取得の開始時刻",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "end_date",
          element: {
            type: "datepicker",
            initial_date: date,
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "end_date",
          },
          label: {
            type: "plain_text",
            text: "ログ取得の終了日",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "end_time",
          element: {
            type: "timepicker",
            initial_time: time,
            placeholder: {
              type: "plain_text",
              text: "Select time",
              emoji: true,
            },
            action_id: "end_time",
          },
          label: {
            type: "plain_text",
            text: "ログ取得の終了時刻",
            emoji: true,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "根本源因の分析を行う",
              },
              style: "primary",
              action_id: "submit_button",
              value: "submit",
            },
          ],
        },
      ];
    }else{
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "It seems that an alarm was happend. If you want to analysis root cause of this failure, please put time range to get the logs that may includes root cause.",
          },
        },
        {
          type: "divider",
        },
        {
          type: "input",
          block_id: "error_description",
          element: {
            type: "plain_text_input",
            action_id: "error_description",
            placeholder: {
              type: "plain_text",
              text: "Ex: It is an monitoring alarm, and the number of errors has exceeded the specified number.",
            },
          },
          label: {
            type: "plain_text",
            text: "The description of the error notification (alarm)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "start_date",
          element: {
            type: "datepicker",
            initial_date: date,
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "start_date",
          },
          label: {
            type: "plain_text",
            text: "Start date to get the logs",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "start_time",
          element: {
            type: "timepicker",
            initial_time: time,
            placeholder: {
              type: "plain_text",
              text: "Select time",
              emoji: true,
            },
            action_id: "start_time",
          },
          label: {
            type: "plain_text",
            text: "Start time to get the logs",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "end_date",
          element: {
            type: "datepicker",
            initial_date: date,
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "end_date",
          },
          label: {
            type: "plain_text",
            text: "End date to get the logs",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "end_time",
          element: {
            type: "timepicker",
            initial_time: time,
            placeholder: {
              type: "plain_text",
              text: "Select time",
              emoji: true,
            },
            action_id: "end_time",
          },
          label: {
            type: "plain_text",
            text: "End time to get the logs",
            emoji: true,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "SUBMIT",
              },
              style: "primary",
              action_id: "submit_button",
              value: "submit",
            },
          ],
        },
      ];
    }
  }
  
  public createInsightCommandFormView(): View {
    return this.language === "ja" ?
    {
      "title": {
        "type": "plain_text",
        "text": "insightコマンドの実行"
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit"
      },
      "type": "modal",
      "callback_id": "view_insight",
      "blocks": [
        {
          "type": "input",
          "block_id": "input_query",
          "label": {
            "type": "plain_text",
            "text": "メトリクスからどのようなことを知りたいですか?"
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "query",
            "multiline": true,
            "placeholder": {
              "type": "plain_text",
              "text": "例：ECSのリソースは十分ですか？チューニングの必要があるか教えてください"
            }
          },
        },
        {
          "type": "input",
          "block_id": "input_duration",
          "element": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "期間を日単位で選択してください",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "1日",
                  "emoji": true
                },
                "value": "1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "2日",
                  "emoji": true
                },
                "value": "2"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "3日",
                  "emoji": true
                },
                "value": "3"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "4日",
                  "emoji": true
                },
                "value": "4"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "5日",
                  "emoji": true
                },
                "value": "5"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "6日",
                  "emoji": true
                },
                "value": "6"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "7日",
                  "emoji": true
                },
                "value": "7"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "8日",
                  "emoji": true
                },
                "value": "8"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "9日",
                  "emoji": true
                },
                "value": "9"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "10日",
                  "emoji": true
                },
                "value": "10"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "11日",
                  "emoji": true
                },
                "value": "11"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "12日",
                  "emoji": true
                },
                "value": "12"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "13日",
                  "emoji": true
                },
                "value": "13"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "14日",
                  "emoji": true
                },
                "value": "14"
              }
            ],
            "action_id": "duration"
          },
          "label": {
            "type": "plain_text",
            "text": "メトリクスを取得する期間",
                    "emoji": true
          }
        }
      ]
    } :
    {
      "title": {
        "type": "plain_text",
        "text": "Invoke insight command"
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit"
      },
      "type": "modal",
      "callback_id": "view_insight",
      "blocks": [
        {
          "type": "input",
          "block_id": "input_query",
          "label": {
            "type": "plain_text",
            "text": "What do you want to know based on metrics?"
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "query",
            "multiline": true,
            "placeholder": {
              "type": "plain_text",
              "text": "Ex. Are ECS resources enough? Please let me know if the tuning is required for this workload."
            }
          }
        },
        {
          "type": "input",
          "block_id": "input_duration",
          "element": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Please select days to get metric data",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "1 Day",
                  "emoji": true
                },
                "value": "1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "2 Days",
                  "emoji": true
                },
                "value": "2"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "3 Days",
                  "emoji": true
                },
                "value": "3"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "4 Days",
                  "emoji": true
                },
                "value": "4"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "5 Days",
                  "emoji": true
                },
                "value": "5"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "6 Days",
                  "emoji": true
                },
                "value": "6"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "7 Days",
                  "emoji": true
                },
                "value": "7"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "8 Days",
                  "emoji": true
                },
                "value": "8"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "9 Days",
                  "emoji": true
                },
                "value": "9"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "10 Days",
                  "emoji": true
                },
                "value": "10"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "11 Days",
                  "emoji": true
                },
                "value": "11"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "12 Days",
                  "emoji": true
                },
                "value": "12"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "13 Days",
                  "emoji": true
                },
                "value": "13"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "14 Days",
                  "emoji": true
                },
                "value": "14"
              }
            ],
            "action_id": "duration"
          },
          "label": {
            "type": "plain_text",
            "text": "Duration of getting metric data",
                    "emoji": true
          }
        }
      ]
    }
  };

  public createMessageBlock(message: string): KnownBlock[] {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      },
    ];
  }

  public createErrorMessageBlock(): KnownBlock[] {
    if(this.language === "ja"){
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "エラーが発生しました。システム管理者にご連絡ください。",
          },
        },
      ];
    }else{
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Error: Please contact your system admin.",
          },
        },
      ];
    }
  }

  // Message template for answer.
  public createAnswerMessage(
    alarmName: string,
    alarmTimestamp: string,
    answer: string,
    howToGetLogs: string,
  ) {
    if(this.language === "ja"){
      return `
    *発生したAlarm:* ${alarmName}\n
    *発生時刻:* ${convertDateFormat(alarmTimestamp)}\n
    *FA2によるエラー原因の仮説:*\n  ${answer}\n
    この後画像に根本原因が図示されます。\n
    -----\n
    *ログの取得方法:*\n ${howToGetLogs}
    `;
    }else{
      return `
    *Alarm name:* ${alarmName}\n
    *Alarm timestamp:* ${convertDateFormat(alarmTimestamp)}\n
    *Assumption of root cause analysis by FA2:*\n  ${answer}\n
    Next, it shows the root cause on the image.\n
    -----\n
    *How to get Logs:*\n ${howToGetLogs}
    `;
    }
  }

  // To send message via Slack directly.
  public async sendMessage(
    message: KnownBlock[] | string,
    channelId: string,
    threadTs?: string
  ){
    try {
      if (threadTs) {
        await this.slackClient.chat.postMessage({
          channel: channelId,
          text: "FA2からのメッセージ",
          blocks: message as KnownBlock[],
          thread_ts: threadTs,
        });
      } else {
        await this.slackClient.chat.postMessage({
          channel: channelId,
          text: "FA2からのメッセージ",
          blocks: message as KnownBlock[]
        });
      }
    } catch (error) {
      logger.error("Failed", error as Error);
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: "Error. Please contact your system admin.",
        thread_ts: threadTs,
      });
    }
  }

  // Send snippet that is markdown docuemnt
  public async sendMarkdownSnippet(
    filename: string,
    markdownText: string,
    channelId: string,
    threadTs?: string
  ){
    try {
      if (threadTs) {
        await this.slackClient.filesUploadV2({
          channel_id: channelId,
          thread_ts: threadTs!,
          filename,
          content: markdownText,
          snippet_type: 'markdown'
        });
      } else {
        await this.slackClient.filesUploadV2({
          channel_id: channelId!,
          filename,
          content: markdownText,
          snippet_type: 'markdown'
        });
      }
    } catch (error) {
      logger.error("Failed", error as Error);
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: "Error. Please contact your system admin.",
        thread_ts: threadTs,
      });
    }
  }

  public async sendFile(
    file: Uint8Array<ArrayBufferLike> | undefined,
    filename: string,
    channelId: string,
    threadTs?: string
  ){
    try {
      let uploadedFile;
      if(threadTs){
        uploadedFile = await this.slackClient.filesUploadV2({
          channel_id: channelId,
          thread_ts: threadTs,
          file: Buffer.from(file!),
          filename,
          initial_comment: this.language === "ja" ? "ファイルをアップロードしました" : "Uploaded a file."
        })
      }else{
        uploadedFile = await this.slackClient.filesUploadV2({
          channel_id: channelId,
          file: Buffer.from(file!),
          filename,
          initial_comment: this.language === "ja" ? "ファイルをアップロードしました" : "Uploaded a file."
        })
      }
      logger.info('Uploaded file', {uploadFile: JSON.stringify(uploadedFile.files.at(0)!.files!.at(0)!)})
    } catch (error) {
      logger.error("Failed", error as Error);
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: "Error. Please contact your system admin.",
        thread_ts: threadTs,
      });
    }
  }
}
  */ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9sYW1iZGEvbGliL21lc3NhZ2UtY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4NUJJIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuaW1wb3J0IHsgZm9ybWF0LCBwYXJzZSB9IGZyb20gXCJkYXRlLWZuc1wiO1xyXG5pbXBvcnQgeyBLbm93bkJsb2NrLCBWaWV3IH0gZnJvbSBcIkBzbGFjay90eXBlc1wiO1xyXG5pbXBvcnQgeyBXZWJDbGllbnQgfSBmcm9tIFwiQHNsYWNrL3dlYi1hcGlcIjtcclxuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXIuanNcIjtcclxuaW1wb3J0IHsgTGFuZ3VhZ2UgfSBmcm9tIFwiLi4vLi4vcGFyYW1ldGVyLmpzXCI7XHJcblxyXG5mdW5jdGlvbiBjb252ZXJ0RGF0ZUZvcm1hdChkYXRlU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIC8vIFBhcnNlIGRhdGVTdHJpbmcgZnJvbSBzcGVjaWZpYyBmb3JtYXRcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2UoXHJcbiAgICBkYXRlU3RyaW5nLFxyXG4gICAgXCJFRUUsIGRkIE1NTSB5eXl5IEhIOm1tOnNzICdVVEMnXCIsXHJcbiAgICBuZXcgRGF0ZSgpLFxyXG4gICk7XHJcblxyXG4gIC8vIE1vZGlmeSBmb3JtYXQuXHJcbiAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdChwYXJzZWREYXRlLCBcInl5eXktTU0tZGQgSEg6bW06c3NcIik7XHJcblxyXG4gIHJldHVybiBmb3JtYXR0ZWREYXRlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VDbGllbnQge1xyXG4gIHNsYWNrQ2xpZW50OiBXZWJDbGllbnQ7XHJcbiAgbGFuZ3VhZ2U6IExhbmd1YWdlOyBcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHRva2VuOiBzdHJpbmcsXHJcbiAgICBsYW5ndWFnZTogTGFuZ3VhZ2UgPSBcImVuXCIsXHJcbiAgKXtcclxuICAgIHRoaXMuc2xhY2tDbGllbnQgPSBuZXcgV2ViQ2xpZW50KHRva2VuKTtcclxuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcclxuICB9XHJcbiAgXHJcbiAgLy8gSXQncyBhbiBleHBsYW5hdGlvbiB0byBhdm9pZCB0aGUgaGFsbHVjaW5hdGlvbiB0aGF0IG1heSBpbmNsdWRlIGluIGxsbSdzIGFuc3dlci5cclxuICBwdWJsaWMgY3JlYXRlSG93VG9HZXRMb2dzKFxyXG4gICAgc3RhcnREYXRlOiBzdHJpbmcsXHJcbiAgICBlbmREYXRlOiBzdHJpbmcsXHJcbiAgICBsb2dHcm91cHM6IHN0cmluZ1tdLFxyXG4gICAgY3dMb2dzUXVlcnk6IHN0cmluZyxcclxuICAgIGN3TWV0cmljUXVlcnk6IHN0cmluZyxcclxuICAgIHhyYXlUcmFjZXM6IGJvb2xlYW4sXHJcbiAgICBhbGJRdWVyeT86IHN0cmluZyxcclxuICAgIHRyYWlsUXVlcnk/OiBzdHJpbmcsXHJcbiAgKSB7XHJcbiAgICBsZXQgaG93VG9HZXRMb2dzOiBzdHJpbmc7XHJcblxyXG4gICAgaWYodGhpcy5sYW5ndWFnZSA9PT0gXCJqYVwiKXtcclxuICAgICAgaG93VG9HZXRMb2dzID0gXHJcbmBcclxuIyDjg63jgrDjgoTjg6Hjg4jjg6rjgq/jgrnjgIHjg4jjg6zjg7zjgrnjga7lj5blvpfmiYvpoIZcclxuXHJcbuWPguiAg+OBq+OBl+OBn+ODreOCsOOBr+OAgeOBneOCjOOBnuOCjOS7peS4i+OBruaJi+mghuOBqOOCr+OCqOODquOBp+WPluW+l+WPr+iDveOBp+OBmeOAglxcblxyXG5cclxuIyMgQ2xvdWRXYXRjaCBMb2dzXHJcblxyXG5DbG91ZFdhdGNoIExvZ3MgSW5zaWdodOOBruOCs+ODs+OCveODvOODq+OBq+OBpuOAgeWvvuixoeODreOCsOOCsOODq+ODvOODl+OCkuaMh+WumuOBl+OAgeaZgumWk+evhOWbsuOCkiBcXGAke3N0YXJ0RGF0ZX1cXGAg44GL44KJIFxcYCR7ZW5kRGF0ZX1cXGAg44Go6Kit5a6a44GX44Gf5LiK44Gn44CB44Kv44Ko44Oq44KS5a6f6KGM44GX44Gm44GP44Gg44GV44GE44CCXFxuXHJcblxyXG4jIyMg5a++6LGh44Ot44Kw44Kw44Or44O844OXXHJcblxyXG5cXGBcXGBcXGAke2xvZ0dyb3Vwcy5qb2luKFwiLCBcIil9XFxgXFxgXFxgXHJcblxyXG4jIyMg44Kv44Ko44OqXHJcblxyXG5cXGBcXGBcXGAke2N3TG9nc1F1ZXJ5fVxcYFxcYFxcYFxyXG5cclxuYDtcclxuXHJcbiAgaG93VG9HZXRMb2dzICs9IGFsYlF1ZXJ5XHJcbiAgICA/IFxyXG5gIyMgQUxCXHJcblxyXG5BdGhlbmHjga7jgrPjg7Pjgr3jg7zjg6vjgafjgIEgXFxgJHtwcm9jZXNzLmVudi5BVEhFTkFfREFUQUJBU0VfTkFNRX1cXGAg44Gu44OH44O844K/44OZ44O844K544Gr5a++44GX44CB44Kv44Ko44Oq44KS5a6f6KGM44GX44Gm44GP44Gg44GV44GE44CCXFxuXHJcblxyXG4jIyMg44Kv44Ko44OqXHJcblxyXG5cXGBcXGBcXGAke2FsYlF1ZXJ5fSBcXGBcXGBcXGBcclxuXHJcbmBcclxuICAgIDogXCJcIjtcclxuXHJcbiAgaG93VG9HZXRMb2dzICs9IHRyYWlsUXVlcnlcclxuICAgID8gXHJcbmAjIyBDbG91ZFRyYWlsXHJcblxyXG5BdGhlbmHjga7jgrPjg7Pjgr3jg7zjg6vjgafjgIEgXFxgJHtwcm9jZXNzLmVudi5BVEhFTkFfREFUQUJBU0VfTkFNRX1cXGAg44Gu44OH44O844K/44OZ44O844K544Gr5a++44GX44CB44Kv44Ko44Oq44KS5a6f6KGM44GX44Gm44GP44Gg44GV44GE44CCXHJcblxyXG4jIyMg44Kv44Ko44OqXHJcblxyXG5cXGBcXGBcXGAke3RyYWlsUXVlcnl9XFxgXFxgXFxgXHJcblxyXG4gICAgYFxyXG4gICAgICAgIDogXCJcIjtcclxuXHJcbiAgICAgIGhvd1RvR2V0TG9ncyArPSBgXHJcbiMjIENsb3VkV2F0Y2jjga7jg6Hjg4jjg6rjgq/jgrlcclxuXHJcbuasoeOBruOCr+OCqOODquOCkuODreODvOOCq+ODq+eSsOWig+OBq0pTT07lvaLlvI/jgafkv53lrZjjgZfjgIFDTEnjgafjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZfjgabjgY/jgaDjgZXjgYTjgIJcclxuXHJcbiMjIyDjgq/jgqjjg6pcclxuXHJcblxcYFxcYFxcYCR7Y3dNZXRyaWNRdWVyeX1cXGBcXGBcXGBcclxuXHJcbiMjIyDjgrPjg57jg7Pjg4lcclxuXHJcblxcYFxcYFxcYGF3cyBjbG91ZHdhdGNoIGdldC1tZXRyaWMtZGF0YSAtLW1ldHJpYy1kYXRhLXF1ZXJpZXMgZmlsZTovL3twYXRoLXRvLWZpbGUvbmFtZS15b3Utc2F2ZWQuanNvbn0gLS1zdGFydC10aW1lICR7c3RhcnREYXRlfSAtLWVuZC10aW1lICR7ZW5kRGF0ZX0gLS1wcm9maWxlIHt5b3VyLXByb2ZpbGUtbmFtZX0gXFxgXFxgXFxgXHJcblxyXG5gXHJcblxyXG4gICAgICBob3dUb0dldExvZ3MgKz0geHJheVRyYWNlc1xyXG4gICAgICAgID8gYFxyXG4jIyBYLXJheeOBruODiOODrOODvOOCueaDheWgsVxyXG5cclxuWC1yYXnjga7jgrPjg7Pjgr3jg7zjg6vjgafjgIHmmYLplpPnr4Tlm7LjgpIgXFxgJHtzdGFydERhdGV9XFxgIOOBi+OCiSBcXGAke2VuZERhdGV9XFxgIOOBq+aMh+WumuOBl+OBpuOBj+OBoOOBleOBhOOAgmBcclxuICAgICAgICA6IFwiXCI7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaG93VG9HZXRMb2dzID0gYFxyXG4jIEhvdyB0byBHZXQuLlxyXG5cclxuWW91IGNhbiBnZXQgdGhlIGxvZ3MgdGhhdCBMTE0gcmVmZXJlZCBmb2xsb3dlZCB3YXlzLlxyXG5cclxuIyMgQ2xvdWRXYXRjaCBMb2dzXHJcblxyXG5DbG91ZFdhdGNoIExvZ3MgSW5zaWdodCBDb25zb2xlLCB5b3UgY2hvb3NlIHRhcmdldCBsb2cgZ3JvdXBzIGFuZCBzZXQgdGltZSByYW5nZSBsaWtlIGZyb20gXFxgJHtzdGFydERhdGV9XFxgIHRvIFxcYCR7ZW5kRGF0ZX1cXGAuIEZpbmFsbHksIHlvdSBydW4gcXVlcnkgYXMgYmVsb3c6XFxuXHJcblxyXG4jIyMgVGFyZ2V0IGxvZyBncm91cHNcclxuXHJcblxcYFxcYFxcYCR7bG9nR3JvdXBzLmpvaW4oXCIsIFwiKX1cXGBcXGBcXGBcclxuXHJcbiMjIyBRdWVyeVxyXG5cclxuXFxgXFxgXFxgJHtjd0xvZ3NRdWVyeX1cXGBcXGBcXGBcclxuYDtcclxuXHJcbiAgICAgIGhvd1RvR2V0TG9ncyArPSBhbGJRdWVyeVxyXG4gICAgICAgID8gYFxyXG4jIyBBTEJcclxuXHJcbkluIEF0aGVuYSdzIG1hbmFnZW1lbnQgY29uc29sZSwgWW91IHJ1biB0aGUgcXVlcnkgdG8gXFxgJHtwcm9jZXNzLmVudi5BVEhFTkFfREFUQUJBU0VfTkFNRX1cXGAgZGF0YWJhc2UuXFxuXHJcblxyXG4jIyMgUXVlcnlcclxuXHJcblxcYFxcYFxcYCR7YWxiUXVlcnl9IFxcYFxcYFxcYFxyXG5cclxuYFxyXG4gICAgICAgIDogXCJcIjtcclxuXHJcbiAgICAgIGhvd1RvR2V0TG9ncyArPSB0cmFpbFF1ZXJ5XHJcbiAgICAgICAgPyBgXHJcbiMjIENsb3VkVHJhaWxcclxuXHJcbkluIEF0aGVuYSdzIG1hbmFnZW1lbnQgY29uc29sZSwgWW91IHJ1biB0aGUgcXVlcnkgdG8gXFxgJHtwcm9jZXNzLmVudi5BVEhFTkFfREFUQUJBU0VfTkFNRX1cXGAgZGF0YWJhc2UuXFxuXHJcblxyXG4jIyMgUXVlcnlcclxuXHJcblxcYFxcYFxcYCR7dHJhaWxRdWVyeX1cXGBcXGBcXGBcclxuXHJcbmBcclxuICAgICAgICA6IFwiXCI7XHJcblxyXG4gICAgICBob3dUb0dldExvZ3MgKz0gYFxyXG4jIyBDbG91ZFdhdGNoIE1ldHJpY3NcclxuXHJcbllvdSBzaG91bGQgc2F2ZSBiZWxvdyBxdWVyeSBhcyBKU09OIGZpbGUgdG8geW91ciBsb2NhbCBlbnZpcm9ubWVudCBhbmQgcnVuIHRoZSBjb21tYW5kLlxyXG5cclxuIyMjIFF1ZXJ5XHJcblxyXG5cXGBcXGBcXGAke0pTT04uc3RyaW5naWZ5KGN3TWV0cmljUXVlcnkpfVxcYFxcYFxcYFxyXG4gIFxyXG4jIyMgQ29tbWFuZFxyXG5cclxuXFxgXFxgXFxgYXdzIGNsb3Vkd2F0Y2ggZ2V0LW1ldHJpYy1kYXRhIC0tbWV0cmljLWRhdGEtcXVlcmllcyBmaWxlOi8ve3BhdGgtdG8tZmlsZS9uYW1lLXlvdS1zYXZlZC5qc29ufSAtLXN0YXJ0LXRpbWUgJHtzdGFydERhdGV9IC0tZW5kLXRpbWUgJHtlbmREYXRlfSAtLXByb2ZpbGUge3lvdXItcHJvZmlsZS1uYW1lfSBcXGBcXGBcXGBcclxuXHJcbmBcclxuXHJcbiAgICAgIGhvd1RvR2V0TG9ncyArPSB4cmF5VHJhY2VzXHJcbiAgICAgICAgPyBgXHJcbiMjIFgtcmF5IFRyYWNlc1xyXG5cclxuWC1yYXkncyBtYW5hZ2VtZW50IGNvbnNvbGUsIHBsZWFzZSBzZXQgZGF0YSByYW5nZSBsaWtlIGZyb20gXFxgJHtzdGFydERhdGV9XFxgIHRvIFxcYCR7ZW5kRGF0ZX1cXGAgLmBcclxuICAgICAgICA6IFwiXCI7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhvd1RvR2V0TG9ncztcclxuICB9XHJcblxyXG4gIC8vIE1lc3NhZ2UgdGVtcGxhdGUgYnkgU2xhY2sgQmxvY2sgS2l0XHJcbiAgcHVibGljIGNyZWF0ZUZvcm1CbG9jayhkYXRlOiBzdHJpbmcsIHRpbWU6IHN0cmluZyk6IEtub3duQmxvY2tbXSB7XHJcbiAgICBpZih0aGlzLmxhbmd1YWdlID09PSBcImphXCIpe1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwic2VjdGlvblwiLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm1ya2R3blwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIuOCouODqeODvOODoOOBjOeZuueUn+OBl+OBn+OCiOOBhuOBp+OBmeOAguOCqOODqeODvOOBruWOn+WboOWIhuaekOOCkuOBl+OBn+OBhOWgtOWQiOOBr+OAgeODreOCsOaknOe0ouOCkuihjOOBhuaZguWIu+OBruevhOWbsuOCkuS7peS4i+OBruODleOCqeODvOODoOOBi+OCieWFpeWKm+OBl+OBpuOBj+OBoOOBleOBhOOAguOCouODqeODvOODoOOBrkRhdGFwb2ludOOCkuWPguiAg+OBq+WFpeWKm+OBhOOBn+OBoOOBj+OBqOOAgeavlOi8g+eahOiJr+OBhOe1kOaenOOBjOW+l+OCieOCjOOChOOBmeOBhOOBp+OBmeOAglwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiZGl2aWRlclwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgYmxvY2tfaWQ6IFwiZXJyb3JfZGVzY3JpcHRpb25cIixcclxuICAgICAgICAgIGVsZW1lbnQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0X2lucHV0XCIsXHJcbiAgICAgICAgICAgIGFjdGlvbl9pZDogXCJlcnJvcl9kZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwi5L6L77ya5aSW5b2i55uj6KaW44Gu44Ki44Op44O844Og44Gn44CB44Ko44Op44O85Zue5pWw44GM6KaP5a6a5Lul5LiK44Gr44Gq44Gj44Gm44GE44G+44GZ44CCXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi44Ko44Op44O844Gu6YCa55+l77yI44Ki44Op44O844Og77yJ44Gu5YaF5a65XCIsXHJcbiAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgIGJsb2NrX2lkOiBcInN0YXJ0X2RhdGVcIixcclxuICAgICAgICAgIGVsZW1lbnQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJkYXRlcGlja2VyXCIsXHJcbiAgICAgICAgICAgIGluaXRpYWxfZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHtcclxuICAgICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlNlbGVjdCBhIGRhdGVcIixcclxuICAgICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcInN0YXJ0X2RhdGVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgdGV4dDogXCLjg63jgrDlj5blvpfjga7plovlp4vml6VcIixcclxuICAgICAgICAgICAgZW1vamk6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgYmxvY2tfaWQ6IFwic3RhcnRfdGltZVwiLFxyXG4gICAgICAgICAgZWxlbWVudDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInRpbWVwaWNrZXJcIixcclxuICAgICAgICAgICAgaW5pdGlhbF90aW1lOiB0aW1lLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiU2VsZWN0IHRpbWVcIixcclxuICAgICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcInN0YXJ0X3RpbWVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgdGV4dDogXCLjg63jgrDlj5blvpfjga7plovlp4vmmYLliLtcIixcclxuICAgICAgICAgICAgZW1vamk6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgYmxvY2tfaWQ6IFwiZW5kX2RhdGVcIixcclxuICAgICAgICAgIGVsZW1lbnQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJkYXRlcGlja2VyXCIsXHJcbiAgICAgICAgICAgIGluaXRpYWxfZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHtcclxuICAgICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlNlbGVjdCBhIGRhdGVcIixcclxuICAgICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcImVuZF9kYXRlXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi44Ot44Kw5Y+W5b6X44Gu57WC5LqG5pelXCIsXHJcbiAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgIGJsb2NrX2lkOiBcImVuZF90aW1lXCIsXHJcbiAgICAgICAgICBlbGVtZW50OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwidGltZXBpY2tlclwiLFxyXG4gICAgICAgICAgICBpbml0aWFsX3RpbWU6IHRpbWUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJTZWxlY3QgdGltZVwiLFxyXG4gICAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhY3Rpb25faWQ6IFwiZW5kX3RpbWVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgdGV4dDogXCLjg63jgrDlj5blvpfjga7ntYLkuobmmYLliLtcIixcclxuICAgICAgICAgICAgZW1vamk6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJhY3Rpb25zXCIsXHJcbiAgICAgICAgICBlbGVtZW50czogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwi5qC55pys5rqQ5Zug44Gu5YiG5p6Q44KS6KGM44GGXCIsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzdHlsZTogXCJwcmltYXJ5XCIsXHJcbiAgICAgICAgICAgICAgYWN0aW9uX2lkOiBcInN1Ym1pdF9idXR0b25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogXCJzdWJtaXRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH1lbHNle1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwic2VjdGlvblwiLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm1ya2R3blwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIkl0IHNlZW1zIHRoYXQgYW4gYWxhcm0gd2FzIGhhcHBlbmQuIElmIHlvdSB3YW50IHRvIGFuYWx5c2lzIHJvb3QgY2F1c2Ugb2YgdGhpcyBmYWlsdXJlLCBwbGVhc2UgcHV0IHRpbWUgcmFuZ2UgdG8gZ2V0IHRoZSBsb2dzIHRoYXQgbWF5IGluY2x1ZGVzIHJvb3QgY2F1c2UuXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJkaXZpZGVyXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICBibG9ja19pZDogXCJlcnJvcl9kZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgZWxlbWVudDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRfaW5wdXRcIixcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcImVycm9yX2Rlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJFeDogSXQgaXMgYW4gbW9uaXRvcmluZyBhbGFybSwgYW5kIHRoZSBudW1iZXIgb2YgZXJyb3JzIGhhcyBleGNlZWRlZCB0aGUgc3BlY2lmaWVkIG51bWJlci5cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgdGV4dDogXCJUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yIG5vdGlmaWNhdGlvbiAoYWxhcm0pXCIsXHJcbiAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgIGJsb2NrX2lkOiBcInN0YXJ0X2RhdGVcIixcclxuICAgICAgICAgIGVsZW1lbnQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJkYXRlcGlja2VyXCIsXHJcbiAgICAgICAgICAgIGluaXRpYWxfZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHtcclxuICAgICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlNlbGVjdCBhIGRhdGVcIixcclxuICAgICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcInN0YXJ0X2RhdGVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgdGV4dDogXCJTdGFydCBkYXRlIHRvIGdldCB0aGUgbG9nc1wiLFxyXG4gICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICBibG9ja19pZDogXCJzdGFydF90aW1lXCIsXHJcbiAgICAgICAgICBlbGVtZW50OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwidGltZXBpY2tlclwiLFxyXG4gICAgICAgICAgICBpbml0aWFsX3RpbWU6IHRpbWUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJTZWxlY3QgdGltZVwiLFxyXG4gICAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhY3Rpb25faWQ6IFwic3RhcnRfdGltZVwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlN0YXJ0IHRpbWUgdG8gZ2V0IHRoZSBsb2dzXCIsXHJcbiAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgIGJsb2NrX2lkOiBcImVuZF9kYXRlXCIsXHJcbiAgICAgICAgICBlbGVtZW50OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXBpY2tlclwiLFxyXG4gICAgICAgICAgICBpbml0aWFsX2RhdGU6IGRhdGUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJTZWxlY3QgYSBkYXRlXCIsXHJcbiAgICAgICAgICAgICAgZW1vamk6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFjdGlvbl9pZDogXCJlbmRfZGF0ZVwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIkVuZCBkYXRlIHRvIGdldCB0aGUgbG9nc1wiLFxyXG4gICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICBibG9ja19pZDogXCJlbmRfdGltZVwiLFxyXG4gICAgICAgICAgZWxlbWVudDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInRpbWVwaWNrZXJcIixcclxuICAgICAgICAgICAgaW5pdGlhbF90aW1lOiB0aW1lLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiU2VsZWN0IHRpbWVcIixcclxuICAgICAgICAgICAgICBlbW9qaTogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uX2lkOiBcImVuZF90aW1lXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiRW5kIHRpbWUgdG8gZ2V0IHRoZSBsb2dzXCIsXHJcbiAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwiYWN0aW9uc1wiLFxyXG4gICAgICAgICAgZWxlbWVudHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlNVQk1JVFwiLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc3R5bGU6IFwicHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgIGFjdGlvbl9pZDogXCJzdWJtaXRfYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IFwic3VibWl0XCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHB1YmxpYyBjcmVhdGVJbnNpZ2h0Q29tbWFuZEZvcm1WaWV3KCk6IFZpZXcge1xyXG4gICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2UgPT09IFwiamFcIiA/IFxyXG4gICAge1xyXG4gICAgICBcInRpdGxlXCI6IHtcclxuICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgXCJ0ZXh0XCI6IFwiaW5zaWdodOOCs+ODnuODs+ODieOBruWun+ihjFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwic3VibWl0XCI6IHtcclxuICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgXCJ0ZXh0XCI6IFwiU3VibWl0XCJcclxuICAgICAgfSxcclxuICAgICAgXCJ0eXBlXCI6IFwibW9kYWxcIixcclxuICAgICAgXCJjYWxsYmFja19pZFwiOiBcInZpZXdfaW5zaWdodFwiLFxyXG4gICAgICBcImJsb2Nrc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRcIixcclxuICAgICAgICAgIFwiYmxvY2tfaWRcIjogXCJpbnB1dF9xdWVyeVwiLFxyXG4gICAgICAgICAgXCJsYWJlbFwiOiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwi44Oh44OI44Oq44Kv44K544GL44KJ44Gp44Gu44KI44GG44Gq44GT44Go44KS55+l44KK44Gf44GE44Gn44GZ44GLP1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbGVtZW50XCI6IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dF9pbnB1dFwiLFxyXG4gICAgICAgICAgICBcImFjdGlvbl9pZFwiOiBcInF1ZXJ5XCIsXHJcbiAgICAgICAgICAgIFwibXVsdGlsaW5lXCI6IHRydWUsXHJcbiAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjoge1xyXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICBcInRleHRcIjogXCLkvovvvJpFQ1Pjga7jg6rjgr3jg7zjgrnjga/ljYHliIbjgafjgZnjgYvvvJ/jg4Hjg6Xjg7zjg4vjg7PjgrDjga7lv4XopoHjgYzjgYLjgovjgYvmlZnjgYjjgabjgY/jgaDjgZXjgYRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJ0eXBlXCI6IFwiaW5wdXRcIixcclxuICAgICAgICAgIFwiYmxvY2tfaWRcIjogXCJpbnB1dF9kdXJhdGlvblwiLFxyXG4gICAgICAgICAgXCJlbGVtZW50XCI6IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RhdGljX3NlbGVjdFwiLFxyXG4gICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IHtcclxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwi5pyf6ZaT44KS5pel5Y2Y5L2N44Gn6YG45oqe44GX44Gm44GP44Gg44GV44GEXCIsXHJcbiAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIx5pelXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiZW1vamlcIjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCIxXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiMuaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMlwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjPml6VcIixcclxuICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjNcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCI05pelXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiZW1vamlcIjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCI0XCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiNeaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiNVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjbml6VcIixcclxuICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjZcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCI35pelXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiZW1vamlcIjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCI3XCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiOOaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiOFwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjnml6VcIixcclxuICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxMOaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTBcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxMeaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTFcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxMuaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTJcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxM+aXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTNcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxNOaXpVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTRcIlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJhY3Rpb25faWRcIjogXCJkdXJhdGlvblwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJsYWJlbFwiOiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwi44Oh44OI44Oq44Kv44K544KS5Y+W5b6X44GZ44KL5pyf6ZaTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9IDpcclxuICAgIHtcclxuICAgICAgXCJ0aXRsZVwiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgIFwidGV4dFwiOiBcIkludm9rZSBpbnNpZ2h0IGNvbW1hbmRcIlxyXG4gICAgICB9LFxyXG4gICAgICBcInN1Ym1pdFwiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgIFwidGV4dFwiOiBcIlN1Ym1pdFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwidHlwZVwiOiBcIm1vZGFsXCIsXHJcbiAgICAgIFwiY2FsbGJhY2tfaWRcIjogXCJ2aWV3X2luc2lnaHRcIixcclxuICAgICAgXCJibG9ja3NcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwidHlwZVwiOiBcImlucHV0XCIsXHJcbiAgICAgICAgICBcImJsb2NrX2lkXCI6IFwiaW5wdXRfcXVlcnlcIixcclxuICAgICAgICAgIFwibGFiZWxcIjoge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIldoYXQgZG8geW91IHdhbnQgdG8ga25vdyBiYXNlZCBvbiBtZXRyaWNzP1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbGVtZW50XCI6IHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dF9pbnB1dFwiLFxyXG4gICAgICAgICAgICBcImFjdGlvbl9pZFwiOiBcInF1ZXJ5XCIsXHJcbiAgICAgICAgICAgIFwibXVsdGlsaW5lXCI6IHRydWUsXHJcbiAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjoge1xyXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICBcInRleHRcIjogXCJFeC4gQXJlIEVDUyByZXNvdXJjZXMgZW5vdWdoPyBQbGVhc2UgbGV0IG1lIGtub3cgaWYgdGhlIHR1bmluZyBpcyByZXF1aXJlZCBmb3IgdGhpcyB3b3JrbG9hZC5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInR5cGVcIjogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgXCJibG9ja19pZFwiOiBcImlucHV0X2R1cmF0aW9uXCIsXHJcbiAgICAgICAgICBcImVsZW1lbnRcIjoge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdGF0aWNfc2VsZWN0XCIsXHJcbiAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjoge1xyXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICBcInRleHRcIjogXCJQbGVhc2Ugc2VsZWN0IGRheXMgdG8gZ2V0IG1ldHJpYyBkYXRhXCIsXHJcbiAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwib3B0aW9uc1wiOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxIERheVwiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjIgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMlwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjMgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiM1wiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjQgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiNFwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjUgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiNVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjYgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiNlwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjcgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiN1wiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjggRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiOFwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjkgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiOVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjEwIERheXNcIixcclxuICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjEwXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiMTEgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTFcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGxhaW5fdGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCIxMiBEYXlzXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiZW1vamlcIjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCIxMlwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwbGFpbl90ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIjEzIERheXNcIixcclxuICAgICAgICAgICAgICAgICAgXCJlbW9qaVwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjEzXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiMTQgRGF5c1wiLFxyXG4gICAgICAgICAgICAgICAgICBcImVtb2ppXCI6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiMTRcIlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJhY3Rpb25faWRcIjogXCJkdXJhdGlvblwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJsYWJlbFwiOiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInBsYWluX3RleHRcIixcclxuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRHVyYXRpb24gb2YgZ2V0dGluZyBtZXRyaWMgZGF0YVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1vamlcIjogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBjcmVhdGVNZXNzYWdlQmxvY2sobWVzc2FnZTogc3RyaW5nKTogS25vd25CbG9ja1tdIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiBcInNlY3Rpb25cIixcclxuICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICB0eXBlOiBcIm1ya2R3blwiLFxyXG4gICAgICAgICAgdGV4dDogbWVzc2FnZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjcmVhdGVFcnJvck1lc3NhZ2VCbG9jaygpOiBLbm93bkJsb2NrW10ge1xyXG4gICAgaWYodGhpcy5sYW5ndWFnZSA9PT0gXCJqYVwiKXtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcInNlY3Rpb25cIixcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJtcmtkd25cIixcclxuICAgICAgICAgICAgdGV4dDogXCLjgqjjg6njg7zjgYznmbrnlJ/jgZfjgb7jgZfjgZ/jgILjgrfjgrnjg4bjg6DnrqHnkIbogIXjgavjgZTpgKPntaHjgY/jgaDjgZXjgYTjgIJcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH1lbHNle1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwic2VjdGlvblwiLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm1ya2R3blwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIkVycm9yOiBQbGVhc2UgY29udGFjdCB5b3VyIHN5c3RlbSBhZG1pbi5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1lc3NhZ2UgdGVtcGxhdGUgZm9yIGFuc3dlci5cclxuICBwdWJsaWMgY3JlYXRlQW5zd2VyTWVzc2FnZShcclxuICAgIGFsYXJtTmFtZTogc3RyaW5nLFxyXG4gICAgYWxhcm1UaW1lc3RhbXA6IHN0cmluZyxcclxuICAgIGFuc3dlcjogc3RyaW5nLFxyXG4gICAgaG93VG9HZXRMb2dzOiBzdHJpbmcsXHJcbiAgKSB7XHJcbiAgICBpZih0aGlzLmxhbmd1YWdlID09PSBcImphXCIpe1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgKueZuueUn+OBl+OBn0FsYXJtOiogJHthbGFybU5hbWV9XFxuXHJcbiAgICAq55m655Sf5pmC5Yi7OiogJHtjb252ZXJ0RGF0ZUZvcm1hdChhbGFybVRpbWVzdGFtcCl9XFxuXHJcbiAgICAqRkEy44Gr44KI44KL44Ko44Op44O85Y6f5Zug44Gu5Luu6KqsOipcXG4gICR7YW5zd2VyfVxcblxyXG4gICAg44GT44Gu5b6M55S75YOP44Gr5qC55pys5Y6f5Zug44GM5Zuz56S644GV44KM44G+44GZ44CCXFxuXHJcbiAgICAtLS0tLVxcblxyXG4gICAgKuODreOCsOOBruWPluW+l+aWueazlToqXFxuICR7aG93VG9HZXRMb2dzfVxyXG4gICAgYDtcclxuICAgIH1lbHNle1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgKkFsYXJtIG5hbWU6KiAke2FsYXJtTmFtZX1cXG5cclxuICAgICpBbGFybSB0aW1lc3RhbXA6KiAke2NvbnZlcnREYXRlRm9ybWF0KGFsYXJtVGltZXN0YW1wKX1cXG5cclxuICAgICpBc3N1bXB0aW9uIG9mIHJvb3QgY2F1c2UgYW5hbHlzaXMgYnkgRkEyOipcXG4gICR7YW5zd2VyfVxcblxyXG4gICAgTmV4dCwgaXQgc2hvd3MgdGhlIHJvb3QgY2F1c2Ugb24gdGhlIGltYWdlLlxcblxyXG4gICAgLS0tLS1cXG5cclxuICAgICpIb3cgdG8gZ2V0IExvZ3M6KlxcbiAke2hvd1RvR2V0TG9nc31cclxuICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBUbyBzZW5kIG1lc3NhZ2UgdmlhIFNsYWNrIGRpcmVjdGx5LlxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShcclxuICAgIG1lc3NhZ2U6IEtub3duQmxvY2tbXSB8IHN0cmluZyxcclxuICAgIGNoYW5uZWxJZDogc3RyaW5nLFxyXG4gICAgdGhyZWFkVHM/OiBzdHJpbmdcclxuICApe1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKHRocmVhZFRzKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zbGFja0NsaWVudC5jaGF0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgIGNoYW5uZWw6IGNoYW5uZWxJZCxcclxuICAgICAgICAgIHRleHQ6IFwiRkEy44GL44KJ44Gu44Oh44OD44K744O844K4XCIsXHJcbiAgICAgICAgICBibG9ja3M6IG1lc3NhZ2UgYXMgS25vd25CbG9ja1tdLFxyXG4gICAgICAgICAgdGhyZWFkX3RzOiB0aHJlYWRUcyxcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNsYWNrQ2xpZW50LmNoYXQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgY2hhbm5lbDogY2hhbm5lbElkLFxyXG4gICAgICAgICAgdGV4dDogXCJGQTLjgYvjgonjga7jg6Hjg4Pjgrvjg7zjgrhcIixcclxuICAgICAgICAgIGJsb2NrczogbWVzc2FnZSBhcyBLbm93bkJsb2NrW11cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkXCIsIGVycm9yIGFzIEVycm9yKTtcclxuICAgICAgYXdhaXQgdGhpcy5zbGFja0NsaWVudC5jaGF0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjaGFubmVsOiBjaGFubmVsSWQsXHJcbiAgICAgICAgdGV4dDogXCJFcnJvci4gUGxlYXNlIGNvbnRhY3QgeW91ciBzeXN0ZW0gYWRtaW4uXCIsXHJcbiAgICAgICAgdGhyZWFkX3RzOiB0aHJlYWRUcyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZW5kIHNuaXBwZXQgdGhhdCBpcyBtYXJrZG93biBkb2N1ZW1udFxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWFya2Rvd25TbmlwcGV0KFxyXG4gICAgZmlsZW5hbWU6IHN0cmluZyxcclxuICAgIG1hcmtkb3duVGV4dDogc3RyaW5nLFxyXG4gICAgY2hhbm5lbElkOiBzdHJpbmcsXHJcbiAgICB0aHJlYWRUcz86IHN0cmluZ1xyXG4gICl7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodGhyZWFkVHMpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNsYWNrQ2xpZW50LmZpbGVzVXBsb2FkVjIoe1xyXG4gICAgICAgICAgY2hhbm5lbF9pZDogY2hhbm5lbElkLFxyXG4gICAgICAgICAgdGhyZWFkX3RzOiB0aHJlYWRUcyEsXHJcbiAgICAgICAgICBmaWxlbmFtZSxcclxuICAgICAgICAgIGNvbnRlbnQ6IG1hcmtkb3duVGV4dCxcclxuICAgICAgICAgIHNuaXBwZXRfdHlwZTogJ21hcmtkb3duJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2xhY2tDbGllbnQuZmlsZXNVcGxvYWRWMih7XHJcbiAgICAgICAgICBjaGFubmVsX2lkOiBjaGFubmVsSWQhLFxyXG4gICAgICAgICAgZmlsZW5hbWUsXHJcbiAgICAgICAgICBjb250ZW50OiBtYXJrZG93blRleHQsXHJcbiAgICAgICAgICBzbmlwcGV0X3R5cGU6ICdtYXJrZG93bidcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkXCIsIGVycm9yIGFzIEVycm9yKTtcclxuICAgICAgYXdhaXQgdGhpcy5zbGFja0NsaWVudC5jaGF0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjaGFubmVsOiBjaGFubmVsSWQsXHJcbiAgICAgICAgdGV4dDogXCJFcnJvci4gUGxlYXNlIGNvbnRhY3QgeW91ciBzeXN0ZW0gYWRtaW4uXCIsXHJcbiAgICAgICAgdGhyZWFkX3RzOiB0aHJlYWRUcyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgc2VuZEZpbGUoXHJcbiAgICBmaWxlOiBVaW50OEFycmF5PEFycmF5QnVmZmVyTGlrZT4gfCB1bmRlZmluZWQsXHJcbiAgICBmaWxlbmFtZTogc3RyaW5nLFxyXG4gICAgY2hhbm5lbElkOiBzdHJpbmcsXHJcbiAgICB0aHJlYWRUcz86IHN0cmluZ1xyXG4gICl7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXBsb2FkZWRGaWxlO1xyXG4gICAgICBpZih0aHJlYWRUcyl7XHJcbiAgICAgICAgdXBsb2FkZWRGaWxlID0gYXdhaXQgdGhpcy5zbGFja0NsaWVudC5maWxlc1VwbG9hZFYyKHtcclxuICAgICAgICAgIGNoYW5uZWxfaWQ6IGNoYW5uZWxJZCxcclxuICAgICAgICAgIHRocmVhZF90czogdGhyZWFkVHMsXHJcbiAgICAgICAgICBmaWxlOiBCdWZmZXIuZnJvbShmaWxlISksXHJcbiAgICAgICAgICBmaWxlbmFtZSxcclxuICAgICAgICAgIGluaXRpYWxfY29tbWVudDogdGhpcy5sYW5ndWFnZSA9PT0gXCJqYVwiID8gXCLjg5XjgqHjgqTjg6vjgpLjgqLjg4Pjg5fjg63jg7zjg4njgZfjgb7jgZfjgZ9cIiA6IFwiVXBsb2FkZWQgYSBmaWxlLlwiXHJcbiAgICAgICAgfSlcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdXBsb2FkZWRGaWxlID0gYXdhaXQgdGhpcy5zbGFja0NsaWVudC5maWxlc1VwbG9hZFYyKHtcclxuICAgICAgICAgIGNoYW5uZWxfaWQ6IGNoYW5uZWxJZCxcclxuICAgICAgICAgIGZpbGU6IEJ1ZmZlci5mcm9tKGZpbGUhKSxcclxuICAgICAgICAgIGZpbGVuYW1lLFxyXG4gICAgICAgICAgaW5pdGlhbF9jb21tZW50OiB0aGlzLmxhbmd1YWdlID09PSBcImphXCIgPyBcIuODleOCoeOCpOODq+OCkuOCouODg+ODl+ODreODvOODieOBl+OBvuOBl+OBn1wiIDogXCJVcGxvYWRlZCBhIGZpbGUuXCJcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdVcGxvYWRlZCBmaWxlJywge3VwbG9hZEZpbGU6IEpTT04uc3RyaW5naWZ5KHVwbG9hZGVkRmlsZS5maWxlcy5hdCgwKSEuZmlsZXMhLmF0KDApISl9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkXCIsIGVycm9yIGFzIEVycm9yKTtcclxuICAgICAgYXdhaXQgdGhpcy5zbGFja0NsaWVudC5jaGF0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICBjaGFubmVsOiBjaGFubmVsSWQsXHJcbiAgICAgICAgdGV4dDogXCJFcnJvci4gUGxlYXNlIGNvbnRhY3QgeW91ciBzeXN0ZW0gYWRtaW4uXCIsXHJcbiAgICAgICAgdGhyZWFkX3RzOiB0aHJlYWRUcyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiAgKi8iXX0=