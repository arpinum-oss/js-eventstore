import { EventStore } from "../eventStore";
import { DbEvent } from "../types";

export class OpenEventStore extends EventStore {
  public findInDb(): NodeJS.ReadableStream {
    return {
      pipe: () => undefined,
    } as any;
  }

  public insertEventsInDb(): Promise<DbEvent[]> {
    return Promise.resolve([]);
  }
}
