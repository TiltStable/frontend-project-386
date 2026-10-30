import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";

vi.mock("../api-client", () => ({
  eventTypesList: vi.fn(),
  availableSlotsApiList: vi.fn(),
}));

import { availableSlotsApiList, eventTypesList } from "../api-client";
import BookPage from "./BookPage";

const mockedEventTypesList = vi.mocked(eventTypesList);
const mockedAvailableSlotsApiList = vi.mocked(availableSlotsApiList);

const introCall = {
  id: "intro-call",
  title: "Знакомство",
  description: "Короткий звонок",
  durationMinutes: 15,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("BookPage", () => {
  it("shows event types received from the API", async () => {
    mockedEventTypesList.mockResolvedValue({ data: [introCall] } as never);

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

  it("shows available slots grouped by day after selecting an event type", async () => {
    mockedEventTypesList.mockResolvedValue({ data: [introCall] } as never);
    mockedAvailableSlotsApiList.mockResolvedValue({
      data: {
        eventTypeId: "intro-call",
        durationMinutes: 15,
        windowFrom: "2026-10-31",
        windowTo: "2026-11-13",
        slots: ["2026-11-02T09:00:00+03:00", "2026-11-02T09:15:00+03:00"],
      },
    } as never);

    renderWithProviders(<BookPage />);
    fireEvent.click(await screen.findByText("Знакомство"));

    expect(await screen.findByText("09:00")).toBeTruthy();
    expect(screen.getByText("09:15")).toBeTruthy();
    expect(screen.getByText(/понедельник, 2 ноября/)).toBeTruthy();
  });
});
