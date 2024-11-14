import { table } from "./storage";

export const myApi = new sst.aws.ApiGatewayV2("MyApi", {
  link: [table],
});

myApi.route("GET /rune-mint", "packages/functions/src/api.handleGetRuneMint");
