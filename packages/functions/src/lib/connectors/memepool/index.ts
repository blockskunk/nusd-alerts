const axios = require("axios");

export class BlockHeightMonitor {
  apis: { name: string; url: string; parser: (response: any) => any }[];

  reconnectAttempts: number = 0;
  constructor() {
    this.apis = [
      {
        name: "mempool.space",
        url: "https://mempool.space/api/blocks/tip/height",
        parser: (response) => response.data,
      },
      {
        name: "blockstream",
        url: "https://blockstream.info/api/blocks/tip/height",
        parser: (response) => response.data,
      },
      {
        name: "blockchain.info",
        url: "https://blockchain.info/q/getblockcount",
        parser: (response) => response.data,
      },
    ];
  }

  async getCurrentBlockHeight() {
    let lastError = null;

    // Try each API in sequence until one works
    for (const api of this.apis) {
      try {
        console.log(`Trying ${api.name}...`);
        const response = await axios.get(api.url, {
          timeout: 5000, // 5 second timeout
        });
        const height = api.parser(response);
        console.log(`Success with ${api.name}: Block height ${height}`);
        return height;
      } catch (error) {
        if (error instanceof Error) {
          console.warn(`Failed to fetch from ${api.name}:`, error.message);
        } else {
          console.warn(`Failed to fetch from ${api.name}:`, error);
        }
        lastError = error;
      }
    }

    // If all APIs fail, throw the last error
    if (lastError instanceof Error) {
      throw new Error(`All APIs failed. Last error: ${lastError.message}`);
    } else {
      throw new Error("All APIs failed. Unknown error occurred.");
    }
  }
}
