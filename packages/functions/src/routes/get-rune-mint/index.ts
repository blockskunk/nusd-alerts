import { BlockchainStateTracker } from "../../lib/connectors/dynamo";
import { BlockHeightMonitor } from "../../lib/connectors/memepool";
import { Hiro } from "../../lib/connectors/hiro/hiro";
import { ApiHandler } from "../../types/aws";

export const getRuneMint: ApiHandler = async (_event) => {
  console.log("Hello from getRuneMint");

  // Example usage:
  const blockHeightMonitor = new BlockHeightMonitor();
  const blockchainStateTracker = new BlockchainStateTracker(
    "nusd-alerts-state"
  );
  const HiroApi = new Hiro();

  try {
    const height = await blockHeightMonitor.getCurrentBlockHeight();

    console.log(`Current Bitcoin block height: ${height}`);

    const lastProcessedBlock =
      await blockchainStateTracker.getLastProcessedBlock();
    console.log(`Last processed block: ${lastProcessedBlock}`);

    // Right now only checking a single block until outputing needed data to x.
    const result = await HiroApi.getRuneMints(lastProcessedBlock);

    // v0.1 - only check a single block
    // add check to BLOCKCHAIN_STATE to only process if isProcessing is false

    // v0.2 - check all blocks since last processed block
    // switch to HiroApi.checkNewMints oncce paring correclty

    // v0.3 - save data to dynamo
    // Consider saving data in dynamo to not waste api calls

    // v0.4 - post to X
  } catch (error) {
    console.error("Error getting rune-mint data", error);
  }

  return {
    statusCode: 200,
    body: `Processing blockchain rune data...`,
  };
};
