import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, PAINTS_PARTITION } from "../shared/ddb";
import { getAuthenticatedUserId, jsonResponse } from "../shared/http";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
) => {
  const userId = getAuthenticatedUserId(event);
  if (!userId) {
    return jsonResponse(401, { message: "Unauthorized" });
  }

  const id = event.pathParameters?.id;
  if (!id) {
    return jsonResponse(400, { message: "Missing paint id" });
  }

  await ddb.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: PAINTS_PARTITION, SK: id },
    })
  );

  return jsonResponse(200, { id });
};
