import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
export declare function httpTrigger(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
