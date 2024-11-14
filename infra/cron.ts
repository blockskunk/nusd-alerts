import { table } from "./storage";

export const cron = new sst.aws.Cron("NUSDAlertsMintPoll", {
  job: {
    handler: "packages/functions/src/api.handleGetRuneMint",
    link: [table],
  },
  schedule: "rate(1 minute)",
});
