import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, MINIS_PARTITION } from "../shared/ddb";
import { jsonResponse } from "../shared/http";
import type { Mini } from "../shared/mini";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return jsonResponse(400, { message: "Missing mini id" });
  }

  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: MINIS_PARTITION, SK: id },
    })
  );

  if (!result.Item) {
    return jsonResponse(404, { message: "Mini not found" });
  }

  const { PK: _PK, SK, ...rest } = result.Item;
  const mini = { ...rest, id: SK } as Mini;

  return jsonResponse(200, mini);
};
