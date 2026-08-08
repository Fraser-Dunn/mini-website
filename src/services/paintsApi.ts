import type { Paint } from "../types/paint";
import { getIdToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllPaints(): Promise<Paint[]> {
  const res = await fetch(`${API_BASE_URL}/paints`);
  if (!res.ok) {
    throw new Error(`Failed to load paints: ${res.status}`);
  }
  return res.json();
}

export type CreatePaintPayload = Omit<Paint, "id" | "timestamp" | "userRef">;

export async function createPaint(payload: CreatePaintPayload): Promise<Paint> {
  const idToken = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/paints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { message?: string });
    throw new Error(body.message ?? `Failed to create paint: ${res.status}`);
  }
  return res.json();
}

export async function updatePaint(id: string, payload: CreatePaintPayload): Promise<Paint> {
  const idToken = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/paints/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { message?: string });
    throw new Error(body.message ?? `Failed to update paint: ${res.status}`);
  }
  return res.json();
}
