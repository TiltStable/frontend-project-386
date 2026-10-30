export interface EventTypeRecord {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface EventTypeStore {
  list(): EventTypeRecord[];
  get(id: string): EventTypeRecord | undefined;
  create(eventType: EventTypeRecord): EventTypeRecord;
}

export function createInMemoryEventTypeStore(): EventTypeStore {
  const items = new Map<string, EventTypeRecord>();

  return {
    list: () => [...items.values()],
    get: (id) => items.get(id),
    create: (eventType) => {
      items.set(eventType.id, eventType);
      return eventType;
    },
  };
}
