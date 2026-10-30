import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "Calls Calendar" })

@server("http://localhost:3000", "Calls Calendar API")

namespace CallsCalendar;

model HealthStatus {
  status: string;
}

@error model ValidationError {
  @statusCode statusCode: 400;

  code: string;

  message: string;
}

@error model NotFoundError {
  @statusCode statusCode: 404;

  code: string;

  message: string;
}

@error model ConflictError {
  @statusCode statusCode: 409;

  code: string;

  message: string;
}

model EventType {
  id: string;

  @minLength(1)
  @maxLength(200)
  title: string;

  @maxLength(2000)
  description: string;

  @minValue(1)
  @maxValue(480)
  durationMinutes: int32;
}

model EventTypeCreate {
  @pattern("^[a-z0-9-]{1,64}$")
  id: string;

  @minLength(1)
  @maxLength(200)
  title: string;

  @maxLength(2000)
  description: string;

  @minValue(1)
  @maxValue(480)
  durationMinutes: int32;
}

model AvailableSlots {
  eventTypeId: string;

  durationMinutes: int32;

  windowFrom: plainDate;

  windowTo: plainDate;

  slots: utcDateTime[];
}

model Booking {
  id: string;

  eventTypeId: string;

  eventTypeTitle: string;

  start: utcDateTime;

  end: utcDateTime;
}

model BookingCreate {
  eventTypeId: string;

  start: utcDateTime;
}

@route("/health")
interface Health {
  @get check(): HealthStatus;
}

@route("/api/event-types")
interface EventTypes {
  @get list(): EventType[];

  @post create(@body body: EventTypeCreate): {
    @statusCode statusCode: 201;

    @body eventType: EventType;
  } | ValidationError | ConflictError;
}

@route("/api/available-slots")
interface AvailableSlotsApi {
  @get list(@query eventTypeId: string): AvailableSlots | NotFoundError;
}

@route("/api/bookings")
interface Bookings {
  @post create(@body body: BookingCreate): {
    @statusCode statusCode: 201;

    @body booking: Booking;
  } | ValidationError | NotFoundError | ConflictError;
}
