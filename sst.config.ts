/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "NUSD-ALERTS",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const api = await import("./infra/api");

    // Disabled until working with test API call
    // await import("./infra/cron");
    await import("./infra/storage");

    return {
      api: api.myApi.url,
    };
  },
});
