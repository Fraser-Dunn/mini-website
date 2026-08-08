import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, PAINTS_PARTITION } from "../shared/ddb";
import { getAuthenticatedUserId, jsonResponse } from "../shared/http";
import { CreatePaintSchema, type Paint } from "../shared/paint";

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

  if (!event.body) {
    return jsonResponse(400, { message: "Missing request body" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return jsonResponse(400, { message: "Invalid JSON body" });
  }

  const parsed = CreatePaintSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(400, {
      message: "Invalid paint payload",
      issues: parsed.error.issues,
    });
  }

  const existing = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: PAINTS_PARTITION, SK: id },
    })
  );
  if (!existing.Item) {
    return jsonResponse(404, { message: "Paint not found" });
  }

  const paint: Paint = {
    ...parsed.data,
    id,
    timestamp: existing.Item.timestamp,
    userRef: userId,
  };

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { PK: PAINTS_PARTITION, SK: id, ...paint },
    })
  );

  return jsonResponse(200, paint);
};
