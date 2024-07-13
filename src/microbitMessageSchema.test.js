import { test, expect } from "vitest";
import { microbitMessageSchema } from "./microbitMessageSchema.js";
test("empty object fails validation", () => {
    const result = microbitMessageSchema.safeParse({});

    expect(result.success).toBeFalsy();
    expect(result.error).toBeTypeOf("object");
});

test("minimal object passes validation", () => {
    const result = microbitMessageSchema.safeParse({
        type: "microbit",
        from: "neill",
    });

    expect(result.success).toBeTruthy();
    expect(result.error).toBeUndefined();
});

test("extra random field not allowed", () => {
    const objectToValidate = {
        type: "microbit",
        cheekyExtraField: "potato",
        from: "neill",
    };
    const result = microbitMessageSchema.safeParse(objectToValidate);
    console.log(result, objectToValidate);
    expect(result.success).toBeFalsy();
    expect(result.error).toBeTypeOf("object");
    expect(result.error.message).toContain("unrecognized_keys");
});
