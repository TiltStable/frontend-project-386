import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "Calls Calendar" })

@server("http://localhost:3000", "Calls Calendar API")

namespace CallsCalendar;

model HealthStatus {
  status: string;
}

@route("health")
interface Health {
  @get check(): HealthStatus;
}
