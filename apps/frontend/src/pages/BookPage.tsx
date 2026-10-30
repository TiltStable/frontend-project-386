import { Button, Card, Container, Loader, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { availableSlotsApiList, eventTypesList, type EventType } from "../api-client";

const dayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Moscow",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Moscow",
});

function SlotsPanel({ eventType }: { eventType: EventType }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSlots(null);
    setError(null);
    availableSlotsApiList({ query: { eventTypeId: eventType.id } })
      .then(({ data }) => {
        setSlots(data?.slots ?? []);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : String(reason));
      });
  }, [eventType.id]);

  if (error !== null) {
    return <Text c="red">Не удалось загрузить слоты: {error}</Text>;
  }
  if (slots === null) {
    return <Loader size="sm" type="dots" />;
  }
  if (slots.length === 0) {
    return <Text c="dimmed">В ближайшие 14 дней свободных слотов нет.</Text>;
  }

  const slotsByDay = new Map<string, string[]>();
  for (const slot of slots) {
    const day = slot.slice(0, 10);
    slotsByDay.set(day, [...(slotsByDay.get(day) ?? []), slot]);
  }

  return (
    <Stack gap="sm">
      {[...slotsByDay.entries()].map(([day, daySlots]) => (
        <div key={day}>
          <Text fw={600}>{dayFormatter.format(new Date(daySlots[0]))}</Text>
          <Button.Group>
            {daySlots.map((slot) => (
              <Button key={slot} variant="light" size="compact-sm">
                {timeFormatter.format(new Date(slot))}
              </Button>
            ))}
          </Button.Group>
        </div>
      ))}
    </Stack>
  );
}

export default function BookPage() {
  const [eventTypes, setEventTypes] = useState<EventType[] | null>(null);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventTypesList()
      .then(({ data }) => {
        setEventTypes(data ?? []);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : String(reason));
      });
  }, []);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1}>Запись на звонок</Title>
        {error !== null ? (
          <Text c="red">Не удалось загрузить типы встреч: {error}</Text>
        ) : eventTypes === null ? (
          <Loader size="sm" type="dots" />
        ) : eventTypes.length === 0 ? (
          <Text c="dimmed">Пока нет доступных типов встреч.</Text>
        ) : selectedType === null ? (
          <Stack gap="sm">
            <Text c="dimmed">Выберите тип встречи:</Text>
            {eventTypes.map((eventType) => (
              <Card
                key={eventType.id}
                withBorder
                shadow="sm"
                onClick={() => setSelectedType(eventType)}
                style={{ cursor: "pointer" }}
                data-event-type={eventType.id}
              >
                <Stack gap="xs">
                  <Title order={3}>{eventType.title}</Title>
                  <Text>{eventType.description}</Text>
                  <Text size="sm" c="dimmed">
                    Длительность: {eventType.durationMinutes} мин
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : (
          <Stack gap="sm">
            <Button variant="subtle" w="fit-content" onClick={() => setSelectedType(null)}>
              К выбору типа
            </Button>
            <Title order={2}>{selectedType.title}</Title>
            <SlotsPanel eventType={selectedType} />
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
