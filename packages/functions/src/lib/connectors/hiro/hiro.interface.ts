export interface RuneMintMonitorOptions {
  lastProcessedBlock?: number;
  apiUrl?: string;
}

export interface Transaction {
  hash: string;
  outputs: Output[];
}

export interface Output {
  script?: string;
}

export interface BlockResponse {
  transactions: Transaction[];
}

export interface RuneMint {
  txId: string;
  timestamp: number;
  details: RuneDetails; // Replace 'any' with a more specific type if possible
}

export interface RuneDetails {
  // Define the properties of RuneDetails based on the specific Rune protocol
  runeName?: string;
  quantity?: number;
  creator?: string;
  // Additional metadata...
}

export interface RuneTransaction {
  limit: number;
  offset: number;
  total: number;
  results: RuneResult[];
}

export interface RuneResult {
  rune: {
    id: string;
    name: string;
    spaced_name: string;
  };
  operation: "send" | "receive" | "mint" | "burn";
  location: {
    block_hash: string;
    block_height: number;
    tx_id: string;
    tx_index: number;
    timestamp: number;
    vout?: number;
    output?: string;
  };
  address: string;
  receiver_address?: string;
  amount: string;
}
