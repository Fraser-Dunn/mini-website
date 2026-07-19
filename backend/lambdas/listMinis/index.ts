import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, MINIS_PARTITION } from "../shared/ddb";
import { jsonResponse } from "../shared/http";
import type { Mini } from "../shared/mini";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": MINIS_PARTITION },
    })
  );

  const minis: Mini[] = (result.Items ?? []).map((item) => {
    const { PK: _PK, SK, ...rest } = item;
    return { ...rest, id: SK } as Mini;
  });

  minis.sort((a, b) => {
    const setComparison = a.set.localeCompare(b.set);
    return setComparison !== 0 ? setComparison : Number(a.number) - Number(b.number);
  });

  return jsonResponse(200, minis);
};
