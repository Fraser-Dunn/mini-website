import type { Mini } from "../types/mini";
import { getIdToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllMinis(): Promise<Mini[]> {
  const res = await fetch(`${API_BASE_URL}/minis`);
  if (!res.ok) {
    throw new Error(`Failed to load minis: ${res.status}`);
  }
  return res.json();
}

export type CreateMiniPayload = Omit<Mini, "id" | "timestamp" | "userRef">;

export async function createMini(payload: CreateMiniPayload): Promise<Mini> {
  const idToken = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/minis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { message?: string });
    throw new Error(body.message ?? `Failed to create mini: ${res.status}`);
  }
  return res.json();
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export async function getUploadUrl(
  fileName: string,
  contentType: string
): Promise<UploadUrlResponse> {
  const idToken = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!res.ok) {
    throw new Error(`Failed to get upload URL: ${res.status}`);
  }
  return res.json();
}

export async function uploadImageToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Failed to upload image: ${res.status}`);
  }
}
