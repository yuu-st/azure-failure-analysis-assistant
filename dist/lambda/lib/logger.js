"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.Logger = void 0;
/**
 * Logger provides structured logging functionality for Azure Functions.
 * Each log message includes a level tag (INFO, ERROR, WARN, DEBUG) and a service name prefix.
 */
class Logger {
    /**
     * Creates a new instance of Logger.
     *
     * @param context - The Azure Functions invocation context, used for writing logs.
     * @param serviceName - A label identifying the service or function name for the logs.
     */
    constructor(context, serviceName) {
        this.context = context;
        this.serviceName = serviceName;
    }
    /**
     * Logs an informational message with [INFO] level.
     *
     * @param message - The main log message.
     * @param args - Optional additional arguments to include in the log.
     */
    info(message, ...args) {
        this.context.log(`[INFO] [${this.serviceName}] ${message}`, ...args);
    }
    /**
     * Logs an error message with [ERROR] level.
     *
     * @param message - The error message.
     * @param args - Optional error details to include.
     */
    error(message, ...args) {
        this.context.error(`[ERROR] [${this.serviceName}] ${message}`, ...args);
    }
    /**
     * Logs a warning message with [WARN] level.
     *
     * @param message - The warning message.
     * @param args - Optional details to include.
     */
    warn(message, ...args) {
        this.context.warn(`[WARN] [${this.serviceName}] ${message}`, ...args);
    }
    /**
     * Logs a debug message with [DEBUG] level.
     *
     * @param message - The debug message.
     * @param args - Optional data for debugging.
     */
    debug(message, ...args) {
        this.context.log(`[DEBUG] [${this.serviceName}] ${message}`, ...args);
    }
}
exports.Logger = Logger;
/**
 * Factory function to create a logger with the given context and service name.
 *
 * @param context - The Azure Functions invocation context.
 * @param serviceName - A label to identify the log source.
 * @returns A Logger instance configured with the specified context and service name.
 */
function createLogger(context, serviceName) {
    return new Logger(context, serviceName);
}
exports.createLogger = createLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGFtYmRhL2xpYi9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7OztHQUdHO0FBQ0gsTUFBYSxNQUFNO0lBSWpCOzs7OztPQUtHO0lBQ0gsWUFBWSxPQUEwQixFQUFFLFdBQW1CO1FBQ3pELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxPQUFlLEVBQUUsR0FBRyxJQUFXO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFlLEVBQUUsR0FBRyxJQUFXO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxPQUFlLEVBQUUsR0FBRyxJQUFXO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFlLEVBQUUsR0FBRyxJQUFXO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUM7Q0FDRjtBQXRERCx3QkFzREM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixZQUFZLENBQUMsT0FBMEIsRUFBRSxXQUFtQjtJQUMxRSxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRkQsb0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnZvY2F0aW9uQ29udGV4dCB9IGZyb20gXCJAYXp1cmUvZnVuY3Rpb25zXCI7XHJcblxyXG4vKipcclxuICogTG9nZ2VyIHByb3ZpZGVzIHN0cnVjdHVyZWQgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IGZvciBBenVyZSBGdW5jdGlvbnMuXHJcbiAqIEVhY2ggbG9nIG1lc3NhZ2UgaW5jbHVkZXMgYSBsZXZlbCB0YWcgKElORk8sIEVSUk9SLCBXQVJOLCBERUJVRykgYW5kIGEgc2VydmljZSBuYW1lIHByZWZpeC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gIHByaXZhdGUgY29udGV4dDogSW52b2NhdGlvbkNvbnRleHQ7XHJcbiAgcHJpdmF0ZSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIExvZ2dlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIEF6dXJlIEZ1bmN0aW9ucyBpbnZvY2F0aW9uIGNvbnRleHQsIHVzZWQgZm9yIHdyaXRpbmcgbG9ncy5cclxuICAgKiBAcGFyYW0gc2VydmljZU5hbWUgLSBBIGxhYmVsIGlkZW50aWZ5aW5nIHRoZSBzZXJ2aWNlIG9yIGZ1bmN0aW9uIG5hbWUgZm9yIHRoZSBsb2dzLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGNvbnRleHQ6IEludm9jYXRpb25Db250ZXh0LCBzZXJ2aWNlTmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ncyBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2Ugd2l0aCBbSU5GT10gbGV2ZWwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBtYWluIGxvZyBtZXNzYWdlLlxyXG4gICAqIEBwYXJhbSBhcmdzIC0gT3B0aW9uYWwgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gaW5jbHVkZSBpbiB0aGUgbG9nLlxyXG4gICAqL1xyXG4gIGluZm8obWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgdGhpcy5jb250ZXh0LmxvZyhgW0lORk9dIFske3RoaXMuc2VydmljZU5hbWV9XSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2dzIGFuIGVycm9yIG1lc3NhZ2Ugd2l0aCBbRVJST1JdIGxldmVsLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgLSBUaGUgZXJyb3IgbWVzc2FnZS5cclxuICAgKiBAcGFyYW0gYXJncyAtIE9wdGlvbmFsIGVycm9yIGRldGFpbHMgdG8gaW5jbHVkZS5cclxuICAgKi9cclxuICBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICB0aGlzLmNvbnRleHQuZXJyb3IoYFtFUlJPUl0gWyR7dGhpcy5zZXJ2aWNlTmFtZX1dICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExvZ3MgYSB3YXJuaW5nIG1lc3NhZ2Ugd2l0aCBbV0FSTl0gbGV2ZWwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSB3YXJuaW5nIG1lc3NhZ2UuXHJcbiAgICogQHBhcmFtIGFyZ3MgLSBPcHRpb25hbCBkZXRhaWxzIHRvIGluY2x1ZGUuXHJcbiAgICovXHJcbiAgd2FybihtZXNzYWdlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICB0aGlzLmNvbnRleHQud2FybihgW1dBUk5dIFske3RoaXMuc2VydmljZU5hbWV9XSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2dzIGEgZGVidWcgbWVzc2FnZSB3aXRoIFtERUJVR10gbGV2ZWwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBkZWJ1ZyBtZXNzYWdlLlxyXG4gICAqIEBwYXJhbSBhcmdzIC0gT3B0aW9uYWwgZGF0YSBmb3IgZGVidWdnaW5nLlxyXG4gICAqL1xyXG4gIGRlYnVnKG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICAgIHRoaXMuY29udGV4dC5sb2coYFtERUJVR10gWyR7dGhpcy5zZXJ2aWNlTmFtZX1dICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGxvZ2dlciB3aXRoIHRoZSBnaXZlbiBjb250ZXh0IGFuZCBzZXJ2aWNlIG5hbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIEF6dXJlIEZ1bmN0aW9ucyBpbnZvY2F0aW9uIGNvbnRleHQuXHJcbiAqIEBwYXJhbSBzZXJ2aWNlTmFtZSAtIEEgbGFiZWwgdG8gaWRlbnRpZnkgdGhlIGxvZyBzb3VyY2UuXHJcbiAqIEByZXR1cm5zIEEgTG9nZ2VyIGluc3RhbmNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHNlcnZpY2UgbmFtZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dnZXIoY29udGV4dDogSW52b2NhdGlvbkNvbnRleHQsIHNlcnZpY2VOYW1lOiBzdHJpbmcpOiBMb2dnZXIge1xyXG4gIHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHNlcnZpY2VOYW1lKTtcclxufSJdfQ==