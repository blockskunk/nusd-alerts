import axios from "axios";
import {
  RuneMintMonitorOptions,
  Transaction,
  Output,
  RuneMint,
  RuneDetails,
  RuneResult,
} from "./hiro.interface";
import { fetchAllResults } from "../../utils/axios";

export class Hiro {
  private lastProcessedBlock: number;
  private apiBaseUrl: string;

  constructor(options: RuneMintMonitorOptions = {}) {
    this.lastProcessedBlock = options.lastProcessedBlock || 0;
    this.apiBaseUrl = options.apiUrl || "https://api.hiro.so";
  }

  async checkNewMints(lastProcessedBlock: number, latestBlock: number) {
    const newMintResults = [];
    // Process all blocks since last check
    for (let height = lastProcessedBlock + 1; height <= latestBlock; height++) {
      const mints = await this.getRuneMints(height);

      for (const mint of mints) {
        newMintResults.push(mint);
        // do something with mints here
      }
      console.log("newMintResults", newMintResults);
    }
  }

  async getRuneMints(blockHeight: number): Promise<RuneResult[]> {
    const HIRO_API_URL = `${this.apiBaseUrl}/runes/v1/blocks/${blockHeight}/activity`;
    const HIRO_OFFSET = 60;
    try {
      // Get block transactions
      const response = await fetchAllResults(HIRO_API_URL, HIRO_OFFSET);
      console.log("response", response);
      const nusdTxns: RuneResult[] = [];

      // Process each transaction in the block
      for (const tx of response) {
        if (tx.rune.name === "NUSDNUSDNUSDNUSD") {
          nusdTxns.push(tx);
        }
      }

      return nusdTxns;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to get mints for block ${blockHeight}: ${error.message}`
        );
      } else {
        throw new Error(
          `Failed to get mints for block ${blockHeight}: Unknown error`
        );
      }
    }
  }

  async parseRuneMint(tx: Transaction): Promise<RuneMint | null> {
    try {
      // Get detailed transaction data
      const response = await axios.get(`${this.apiBaseUrl}/tx/${tx.hash}`);
      const txData: { outputs: Output[]; timestamp: number } = response.data;

      // Look for Rune protocol identifiers
      // This is a simplified example - actual implementation depends on the specific Rune protocol
      const isRuneMint: boolean = txData.outputs.some(
        (output: Output) =>
          output.script?.includes("52554E45") || // 'RUNE' in hex
          output.script?.includes("concrete") || // Example Rune protocol identifier
          this.hasRuneProtocolMarkers(output)
      );

      if (isRuneMint) {
        return {
          txId: tx.hash,
          timestamp: txData.timestamp,
          details: this.extractRuneDetails(txData),
        };
      }

      return null;
    } catch (error) {
      console.error(`Error parsing transaction ${tx.hash}:`, error);
      return null;
    }
  }

  hasRuneProtocolMarkers(output: Output): boolean {
    // Add specific Rune protocol markers/identifiers here
    // This would need to be updated based on the exact Rune specification
    return false;
  }

  extractRuneDetails(txData: {
    outputs: Output[];
    timestamp: number;
  }): RuneDetails {
    // Extract relevant Rune details from transaction
    // This would need to be implemented based on the specific Rune protocol
    return {
      // Example fields:
      // runeName: '',
      // quantity: '',
      // creator: '',
      // Additional metadata...
    };
  }
}
