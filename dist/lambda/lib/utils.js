"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
/**
 * Converts a Readable stream into a string
 *
 * @param readableStream - The stream to convert
 * @returns Promise<string> - The resulting string
 */
async function streamToString(logger, readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks).toString("utf-8"));
        });
        readableStream.on("error", (error) => {
            logger.error("Error while reading stream:", error);
            reject(error);
        });
    });
}
exports.streamToString = streamToString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9sYW1iZGEvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLGNBQWMsQ0FBQyxNQUFjLEVBQUUsY0FBcUM7SUFDdEYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBaUIsRUFBRSxDQUFDO1FBRWhDLGNBQWMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBeUIsRUFBRSxFQUFFO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDMUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBbEJELHdDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlci5qc1wiO1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgUmVhZGFibGUgc3RyZWFtIGludG8gYSBzdHJpbmdcclxuICogXHJcbiAqIEBwYXJhbSByZWFkYWJsZVN0cmVhbSAtIFRoZSBzdHJlYW0gdG8gY29udmVydFxyXG4gKiBAcmV0dXJucyBQcm9taXNlPHN0cmluZz4gLSBUaGUgcmVzdWx0aW5nIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0cmVhbVRvU3RyaW5nKGxvZ2dlcjogTG9nZ2VyLCByZWFkYWJsZVN0cmVhbTogTm9kZUpTLlJlYWRhYmxlU3RyZWFtKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2h1bmtzOiBVaW50OEFycmF5W10gPSBbXTtcclxuXHJcbiAgICAgICAgcmVhZGFibGVTdHJlYW0ub24oXCJkYXRhXCIsIChkYXRhOiBCdWZmZXIgfCBVaW50OEFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIGNodW5rcy5wdXNoKGRhdGEgaW5zdGFuY2VvZiBCdWZmZXIgPyBkYXRhIDogQnVmZmVyLmZyb20oZGF0YSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWFkYWJsZVN0cmVhbS5vbihcImVuZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKFwidXRmLThcIikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWFkYWJsZVN0cmVhbS5vbihcImVycm9yXCIsIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJFcnJvciB3aGlsZSByZWFkaW5nIHN0cmVhbTpcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59Il19