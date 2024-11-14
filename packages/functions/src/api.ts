import { Handler } from "aws-lambda";
import { getRuneMint } from "./routes/get-rune-mint";

export const handleGetRuneMint: Handler = async (_event) => {
  console.log("Hello from getRuneMint");
  const response = getRuneMint(_event);
  console.log("Response:", response);
  return {
    statusCode: 200,
    body: `Processing blockchain rune data...`,
  };
};
