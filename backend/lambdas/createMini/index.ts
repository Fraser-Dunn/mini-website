import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { ddb, MINIS_PARTITION } from "../shared/ddb";
import { getAuthenticatedUserId, jsonResponse } from "../shared/http";
import { CreateMiniSchema, type Mini } from "../shared/mini";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
) => {
  const userId = getAuthenticatedUserId(event);
  if (!userId) {
    return jsonResponse(401, { message: "Unauthorized" });
  }

  if (!event.body) {
    return jsonResponse(400, { message: "Missing request body" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return jsonResponse(400, { message: "Invalid JSON body" });
  }

  const parsed = CreateMiniSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(400, {
      message: "Invalid mini payload",
      issues: parsed.error.issues,
    });
  }

  const mini: Mini = {
    ...parsed.data,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    userRef: userId,
  };

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { PK: MINIS_PARTITION, SK: mini.id, ...mini },
    })
  );

  return jsonResponse(201, mini);
};
