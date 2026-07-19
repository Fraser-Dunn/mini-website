import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { getAuthenticatedUserId, jsonResponse } from "../shared/http";
import { GetUploadUrlSchema } from "../shared/mini";

const BUCKET_NAME = process.env.BUCKET_NAME!;
const s3 = new S3Client({});

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

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

  const parsed = GetUploadUrlSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(400, {
      message: "Invalid upload request",
      issues: parsed.error.issues,
    });
  }

  const key = `images/${userId}-${randomUUID()}-${sanitizeFileName(parsed.data.fileName)}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: parsed.data.contentType,
    }),
    { expiresIn: 300 }
  );

  const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return jsonResponse(200, { uploadUrl, key, publicUrl });
};
