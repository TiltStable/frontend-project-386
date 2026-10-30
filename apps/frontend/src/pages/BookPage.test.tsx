import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";

vi.mock("../api-client", () => ({
  eventTypesList: vi.fn(),
}));

import { eventTypesList } from "../api-client";
import BookPage from "./BookPage";

const mockedEventTypesList = vi.mocked(eventTypesList);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("BookPage", () => {
  it("shows event types received from the API", async () => {
    mockedEventTypesList.mockResolvedValue({
      data: [
        {
          id: "intro-call",
          title: "Знакомство",
          description: "Короткий звонок",
          durationMinutes: 15,
        },
      ],
    } as never);

    renderWithProviders(<BookPage />);

    expect(await screen.findByText("Знакомство")).toBeTruthy();
    expect(screen.getByText("Короткий звонок")).toBeTruthy();
    expect(screen.getByText(/Длительность: 15 мин/)).toBeTruthy();
  });

  it("shows a message when there are no event types", async () => {
    mockedEventTypesList.mockResolvedValue({ data: [] } as never);

    renderWithProviders(<BookPage />);

    expect(await screen.findByText("Пока нет доступных типов встреч.")).toBeTruthy();
  });
});
