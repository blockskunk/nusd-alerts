export const table = new sst.aws.Dynamo("nusd-alerts-state", {
  fields: {
    id: "string",
    lastUpdated: "string",
  },
  primaryIndex: {
    hashKey: "id",
    rangeKey: "lastUpdated",
  },
});
