import Knex = require("knex");
import { EventStore } from "../eventStore";
import { DbEvent, DbEventValue } from "../types";

export class OpenEventStore extends EventStore {
  public findInDb(
    _1: Knex.QueryBuilder,
    _2: any,
    _3: any
  ): NodeJS.ReadableStream {
    return {
      pipe: () => undefined,
    } as any;
  }

  public insertEventsInDb(_: DbEventValue[]): Promise<DbEvent[]> {
    return Promise.resolve([]);
  }
}
