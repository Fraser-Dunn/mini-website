import { z } from "zod";

export const SizeSchema = z.enum([
  "Tiny",
  "Small",
  "Medium",
  "Large",
  "Huge",
  "Gargantuan",
]);

// Fields supplied by the client when creating a mini. id/timestamp/userRef
// are always derived server-side and must never be trusted from the client.
export const CreateMiniSchema = z.object({
  name: z.string().min(3).max(40),
  brand: z.string().min(3).max(30),
  maker: z.string().min(3).max(30),
  set: z.string().min(3).max(60),
  number: z.number().int().min(1).max(70),
  quantity: z.number().int().min(1).max(50),
  race: z.string().min(3).max(30),
  gender: z.string().min(3).max(30),
  type: z.string().min(3).max(30),
  size: SizeSchema,
  rarity: z.string().min(3).max(30),
  damaged: z.boolean(),
  statblock: z.string().min(3).max(100),
  imageUrls: z.array(z.string().url()).min(1).max(1),
});

export type CreateMiniInput = z.infer<typeof CreateMiniSchema>;

export interface Mini extends CreateMiniInput {
  id: string;
  timestamp: string;
  userRef: string;
}

export const GetUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(200),
  contentType: z.enum(["image/jpeg", "image/png"]),
});

export type GetUploadUrlInput = z.infer<typeof GetUploadUrlSchema>;
