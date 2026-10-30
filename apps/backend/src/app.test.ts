import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("smoke", () => {
  it("GET /health responds 200 with ok status", async () => {
    const res = await createApp().request("/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
