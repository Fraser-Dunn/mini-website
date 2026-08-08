import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, PAINTS_PARTITION } from "../shared/ddb";
import { jsonResponse } from "../shared/http";
import type { Paint } from "../shared/paint";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": PAINTS_PARTITION },
    })
  );

  const paints: Paint[] = (result.Items ?? []).map((item) => {
    const { PK: _PK, SK, ...rest } = item;
    return { ...rest, id: SK } as Paint;
  });

  paints.sort((a, b) => a.name.localeCompare(b.name));

  return jsonResponse(200, paints);
};
