import { Card, Container, Loader, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { eventTypesList, type EventType } from "../api-client";

export default function BookPage() {
  const [eventTypes, setEventTypes] = useState<EventType[] | null>(null);
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
        <Text c="dimmed">Выберите тип встречи:</Text>
        {error !== null ? (
          <Text c="red">Не удалось загрузить типы встреч: {error}</Text>
        ) : eventTypes === null ? (
          <Loader size="sm" type="dots" />
        ) : eventTypes.length === 0 ? (
          <Text c="dimmed">Пока нет доступных типов встреч.</Text>
        ) : (
          <Stack gap="sm">
            {eventTypes.map((eventType) => (
              <Card key={eventType.id} withBorder shadow="sm" data-event-type={eventType.id}>
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
        )}
      </Stack>
    </Container>
  );
}
