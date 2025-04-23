/// <reference types="node" />
import { Logger } from "./logger.js";
/**
 * Converts a Readable stream into a string
 *
 * @param readableStream - The stream to convert
 * @returns Promise<string> - The resulting string
 */
export declare function streamToString(logger: Logger, readableStream: NodeJS.ReadableStream): Promise<string>;
