export declare class Prompt {
    language: string;
    architectureDescription: string;
    constructor(language: string | undefined, architectureDescription: string);
    createLogAnalysisPrompt(): string;
}
