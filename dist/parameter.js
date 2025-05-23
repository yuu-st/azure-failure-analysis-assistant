"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devParameter = void 0;
// Parameters for Dev Account
exports.devParameter = {
    env: {
        account: "123456789012",
        region: "us-east-1",
    },
    language: "ja",
    envName: "Development",
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    slackAppTokenKey: "SlackAppToken",
    slackSigningSecretKey: "SlackSigningSecret",
    architectureDescription: "あなたが担当するワークロードは、CloudFront、ALB、ECS on EC2、DynamoDBで構成されており、ECS on EC2上にSpringアプリケーションがデプロイされています。",
    slashCommands: {
        insight: false,
        findingsReport: false,
    },
    detectorId: "ccc7636809ab9ef126976785ad0df79e"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcGFyYW1ldGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXVCQSw2QkFBNkI7QUFDaEIsUUFBQSxZQUFZLEdBQWlCO0lBQ3hDLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxjQUFjO1FBQ3ZCLE1BQU0sRUFBRSxXQUFXO0tBQ3BCO0lBQ0QsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUUsYUFBYTtJQUN0QixPQUFPLEVBQUUseUNBQXlDO0lBQ2xELGdCQUFnQixFQUFFLGVBQWU7SUFDakMscUJBQXFCLEVBQUUsb0JBQW9CO0lBQzNDLHVCQUF1QixFQUFFLG1HQUFtRztJQUM1SCxhQUFhLEVBQUU7UUFDYixPQUFPLEVBQUUsS0FBSztRQUNkLGNBQWMsRUFBRSxLQUFLO0tBQ3RCO0lBQ0QsVUFBVSxFQUFFLGtDQUFrQztDQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgTGFuZ3VhZ2UgPSBcImphXCIgfCBcImVuXCI7XHJcbmV4cG9ydCB0eXBlIFNsYXNoQ29tbWFuZHMgPSB7XHJcbiAgaW5zaWdodDogYm9vbGVhbjtcclxuICBmaW5kaW5nc1JlcG9ydDogYm9vbGVhbjtcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIEVudmlyb25tZW50ID0ge1xyXG4gICAgYWNjb3VudDogc3RyaW5nO1xyXG4gICAgcmVnaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXBwUGFyYW1ldGVyIHtcclxuICBlbnY/OiBFbnZpcm9ubWVudDtcclxuICBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcbiAgZW52TmFtZTogc3RyaW5nO1xyXG4gIG1vZGVsSWQ6IHN0cmluZztcclxuICBzbGFja0FwcFRva2VuS2V5OiBzdHJpbmc7XHJcbiAgc2xhY2tTaWduaW5nU2VjcmV0S2V5OiBzdHJpbmc7XHJcbiAgYXJjaGl0ZWN0dXJlRGVzY3JpcHRpb246IHN0cmluZztcclxuICBzbGFzaENvbW1hbmRzOiBTbGFzaENvbW1hbmRzO1xyXG4gIGRldGVjdG9ySWQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIFBhcmFtZXRlcnMgZm9yIERldiBBY2NvdW50XHJcbmV4cG9ydCBjb25zdCBkZXZQYXJhbWV0ZXI6IEFwcFBhcmFtZXRlciA9IHtcclxuICBlbnY6IHtcclxuICAgIGFjY291bnQ6IFwiMTIzNDU2Nzg5MDEyXCIsXHJcbiAgICByZWdpb246IFwidXMtZWFzdC0xXCIsXHJcbiAgfSxcclxuICBsYW5ndWFnZTogXCJqYVwiLFxyXG4gIGVudk5hbWU6IFwiRGV2ZWxvcG1lbnRcIixcclxuICBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1zb25uZXQtMjAyNDAyMjktdjE6MFwiLFxyXG4gIHNsYWNrQXBwVG9rZW5LZXk6IFwiU2xhY2tBcHBUb2tlblwiLFxyXG4gIHNsYWNrU2lnbmluZ1NlY3JldEtleTogXCJTbGFja1NpZ25pbmdTZWNyZXRcIixcclxuICBhcmNoaXRlY3R1cmVEZXNjcmlwdGlvbjogXCLjgYLjgarjgZ/jgYzmi4XlvZPjgZnjgovjg6/jg7zjgq/jg63jg7zjg4njga/jgIFDbG91ZEZyb25044CBQUxC44CBRUNTIG9uIEVDMuOAgUR5bmFtb0RC44Gn5qeL5oiQ44GV44KM44Gm44GK44KK44CBRUNTIG9uIEVDMuS4iuOBq1NwcmluZ+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBjOODh+ODl+ODreOCpOOBleOCjOOBpuOBhOOBvuOBmeOAglwiLFxyXG4gIHNsYXNoQ29tbWFuZHM6IHtcclxuICAgIGluc2lnaHQ6IGZhbHNlLFxyXG4gICAgZmluZGluZ3NSZXBvcnQ6IGZhbHNlLFxyXG4gIH0sXHJcbiAgZGV0ZWN0b3JJZDogXCJjY2M3NjM2ODA5YWI5ZWYxMjY5NzY3ODVhZDBkZjc5ZVwiXHJcbn07Il19