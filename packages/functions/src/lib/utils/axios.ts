import axios, { AxiosResponse } from "axios";
import { RuneResult, RuneTransaction } from "../connectors/hiro/hiro.interface";

export async function fetchAllResults(
  url: string,
  limit: number = 10
): Promise<RuneResult[]> {
  let offset = 0;
  let runeTransactions: RuneResult[] = [];

  while (true) {
    try {
      const response: AxiosResponse<RuneTransaction> = await axios.get(url, {
        params: {
          limit,
          offset,
        },
      });

      const { data } = response;
      const { total, results } = data;
      runeTransactions.push(...results);
      console.log("results", results);

      if (total <= runeTransactions.length) {
        // No more results to fetch
        break;
      }

      offset += limit;
    } catch (error) {
      console.error("Error fetching results:", { error });
      throw new Error("Error fetching results");
      break;
    }
  }

  return runeTransactions;
}
