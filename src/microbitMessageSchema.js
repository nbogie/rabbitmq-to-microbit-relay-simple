import { z } from "zod";
//docs https://zod.dev/?id=basic-usage
export const microbitMessageSchema = z
    .object({
        type: z.literal("microbit"),
        from: z.string().min(1).max(20),
        lightPattern: z.string().min(1).max(20).optional(),
        lightValue: z.number().int().optional(),
        servoValue: z.number().min(0).max(255).optional(),
    })
    .strict();
