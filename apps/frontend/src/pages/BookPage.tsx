import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export default function BookPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1}>Запись на звонок</Title>
        <Text c="dimmed">
          Здесь появится выбор типа встречи и свободных слотов. Функциональность бронирования
          реализуется на следующем шаге.
        </Text>
        <Anchor component={Link} to="/">
          На главную
        </Anchor>
      </Stack>
    </Container>
  );
}
