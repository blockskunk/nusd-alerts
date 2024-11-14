import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface ApiHandler {
  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}
