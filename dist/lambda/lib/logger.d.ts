import { InvocationContext } from "@azure/functions";
/**
 * Logger provides structured logging functionality for Azure Functions.
 * Each log message includes a level tag (INFO, ERROR, WARN, DEBUG) and a service name prefix.
 */
export declare class Logger {
    private context;
    private serviceName;
    /**
     * Creates a new instance of Logger.
     *
     * @param context - The Azure Functions invocation context, used for writing logs.
     * @param serviceName - A label identifying the service or function name for the logs.
     */
    constructor(context: InvocationContext, serviceName: string);
    /**
     * Logs an informational message with [INFO] level.
     *
     * @param message - The main log message.
     * @param args - Optional additional arguments to include in the log.
     */
    info(message: string, ...args: any[]): void;
    /**
     * Logs an error message with [ERROR] level.
     *
     * @param message - The error message.
     * @param args - Optional error details to include.
     */
    error(message: string, ...args: any[]): void;
    /**
     * Logs a warning message with [WARN] level.
     *
     * @param message - The warning message.
     * @param args - Optional details to include.
     */
    warn(message: string, ...args: any[]): void;
    /**
     * Logs a debug message with [DEBUG] level.
     *
     * @param message - The debug message.
     * @param args - Optional data for debugging.
     */
    debug(message: string, ...args: any[]): void;
}
/**
 * Factory function to create a logger with the given context and service name.
 *
 * @param context - The Azure Functions invocation context.
 * @param serviceName - A label to identify the log source.
 * @returns A Logger instance configured with the specified context and service name.
 */
export declare function createLogger(context: InvocationContext, serviceName: string): Logger;
