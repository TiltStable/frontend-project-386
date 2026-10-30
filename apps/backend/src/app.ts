import { Hono } from "hono";
import { cors } from "hono/cors";
import { validateEventTypeCreate } from "./domain/eventType.js";
import type { EventTypeStore } from "./store.js";

export interface AppDeps {
  eventTypes: EventTypeStore;
}

export function createApp(deps: AppDeps) {
  const app = new Hono();

  app.use(cors());

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.get("/api/event-types", (c) => c.json(deps.eventTypes.list()));

  app.post("/api/event-types", async (c) => {
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json(
        { code: "INVALID_JSON", message: "Тело запроса должно быть корректным JSON." },
        400,
      );
    }

    const result = validateEventTypeCreate(raw);
    if (!result.ok) {
      return c.json(result.error, 400);
    }

    if (deps.eventTypes.get(result.value.id) !== undefined) {
      return c.json(
        { code: "EVENT_TYPE_ID_TAKEN", message: "Тип события с таким id уже существует." },
        409,
      );
    }

    return c.json(deps.eventTypes.create(result.value), 201);
  });

  return app;
}
