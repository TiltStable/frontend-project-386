import { Hono } from "hono";
import { cors } from "hono/cors";
import { formatOffsetDateTime } from "./domain/datetime.js";
import { validateEventTypeCreate } from "./domain/eventType.js";
import { computeAvailableSlots } from "./domain/slots.js";
import { createInMemoryBookingStore, type BookingStore, type EventTypeStore } from "./store.js";

export interface AppDeps {
  eventTypes: EventTypeStore;
  bookings?: BookingStore;
  now?: () => number;
}

export function createApp(deps: AppDeps) {
  const bookings = deps.bookings ?? createInMemoryBookingStore();
  const now = deps.now ?? (() => Date.now());
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

  app.get("/api/available-slots", (c) => {
    const eventTypeId = c.req.query("eventTypeId");
    if (!eventTypeId) {
      return c.json({ code: "INVALID_REQUEST", message: "Укажите eventTypeId." }, 400);
    }

    const eventType = deps.eventTypes.get(eventTypeId);
    if (eventType === undefined) {
      return c.json({ code: "EVENT_TYPE_NOT_FOUND", message: "Тип события не найден." }, 404);
    }

    const result = computeAvailableSlots({
      now: now(),
      durationMinutes: eventType.durationMinutes,
      bookings: bookings.list(),
    });

    return c.json({
      eventTypeId: eventType.id,
      durationMinutes: eventType.durationMinutes,
      windowFrom: result.windowFrom,
      windowTo: result.windowTo,
      slots: result.slots.map(formatOffsetDateTime),
    });
  });

  return app;
}
