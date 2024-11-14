import { Resource } from "sst";
import {
  DescribeTableCommand,
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

export class BlockchainStateTracker {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;
  private stateKey = "BLOCKCHAIN_STATE"; // Constant key for the state record

  constructor(tableName: string) {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = Resource["nusd-alerts-state"].name;
  }

  getLastProcessedBlock = async () => {
    try {
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: this.stateKey },
        },
        ScanIndexForward: false,
        Limit: 1,
      };
      const response = await this.docClient.send(new QueryCommand(params));
      if (response.Items && response.Items.length > 0) {
        return Number(response.Items[0].lastProcessedBlock.N);
      }
      return 0; // Safe default if no state exists
    } catch (error) {
      console.error("Error getting last processed block:", error);
      return 0; // Safe default if no state exists
      throw new Error("Error getting last processed block");
    }
  };

  updateLastProcessedBlock = async (blockNumber: number) => {
    try {
      await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: {
            id: this.stateKey,
          },
          UpdateExpression:
            "set lastProcessedBlock = :blockNumber, lastUpdated = :lastUpdated",
          ExpressionAttributeValues: {
            ":blockNumber": blockNumber,
            ":lastUpdated": new Date().toISOString(),
          },
        })
      );
    } catch (error) {
      console.error("Error updating last processed block:", error);
      throw new Error("Error updating last processed block");
    }
  };

  // async processBlockRange(currentBlockHeight: number): Promise<void> {
  //   const lastProcessedBlock = await this.getLastProcessedBlock();

  //   // Process all blocks since last check
  //   for (
  //     let height = lastProcessedBlock + 1;
  //     height <= currentBlockHeight;
  //     height++
  //   ) {
  //     try {
  //       await this.updateLastProcessedBlock(height);
  //     } catch (error) {
  //       console.error(`Error processing block ${height}:`, error);
  //       // Don't update lastProcessedBlock so we can retry this block next time
  //       throw error;
  //     }
  //   }
  // }
}
