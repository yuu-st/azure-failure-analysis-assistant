export type Language = "ja" | "en";
export type SlashCommands = {
    insight: boolean;
    findingsReport: boolean;
};
export type Environment = {
    account: string;
    region: string;
};
export interface AppParameter {
    env?: Environment;
    language: Language;
    envName: string;
    modelId: string;
    slackAppTokenKey: string;
    slackSigningSecretKey: string;
    architectureDescription: string;
    slashCommands: SlashCommands;
    detectorId?: string;
}
export declare const devParameter: AppParameter;
