import { z } from "zod";

export const PEG_BOARD_LOCATION = "Peg board";

// Fields supplied by the client when creating a paint. id/timestamp/userRef
// are always derived server-side and must never be trusted from the client.
export const CreatePaintSchema = z
  .object({
    brand: z.string().min(1).max(40),
    name: z.string().min(1).max(60),
    parentColours: z.array(z.string().min(1).max(20)).min(1).max(5),
    type: z.string().min(1).max(20),
    count: z.number().int().min(0).max(99),
    location: z.string().min(1).max(60),
    hex: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "hex must look like #8f1f1f")
      .optional(),
    pegRow: z.number().int().min(1).max(40).optional(),
    pegSlot: z.number().int().min(1).max(15).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.location !== PEG_BOARD_LOCATION) {
      return;
    }
    if (val.pegRow === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "pegRow is required when location is Peg board",
        path: ["pegRow"],
      });
    }
    if (val.pegSlot === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "pegSlot is required when location is Peg board",
        path: ["pegSlot"],
      });
    }
  });

export type CreatePaintInput = z.infer<typeof CreatePaintSchema>;

export interface Paint extends CreatePaintInput {
  id: string;
  timestamp: string;
  userRef: string;
}
