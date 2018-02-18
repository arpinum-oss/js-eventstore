import { wrap } from '@arpinum/promising';
import * as Knex from 'knex';

import { dbEventToEvent, eventToDbEvent } from './mapping';
import { streamMapper } from './streaming';
import { DbEvent, Event, NewEvent } from './types';

export interface EventStoreOptions {
  tableName?: string;
}

const defaultBatchSize = 1000;

export class EventStore {
  private client: Knex;
  private options: EventStoreOptions;

  constructor(client: Knex, options?: EventStoreOptions) {
    this.client = client;
    this.options = { tableName: 'events', ...options };
  }

  public destroy(): Promise<void> {
    return wrap(() => this.client.destroy())().then(() => undefined);
  }

  public add(event: NewEvent): Promise<Event> {
    const dbEvent = eventToDbEvent(event);
    return wrap(() => this.table.insert(dbEvent).returning('*'))().then(
      (insertedEvents: DbEvent[]) => dbEventToEvent(insertedEvents[0])
    );
  }

  public addAll(events: NewEvent[]): Promise<Event[]> {
    if (events.length === 0) {
      return Promise.resolve([]);
    }
    const dbEvents = events.map(eventToDbEvent);
    return wrap(() => this.table.insert(dbEvents).returning('*'))().then(
      (insertedEvents: DbEvent[]) => insertedEvents.map(dbEventToEvent)
    );
  }

  public eventsFromTarget(
    criteria: {
      id?: string;
      type?: string;
    },
    options: { batchSize?: number } = {}
  ): NodeJS.ReadableStream {
    const { id, type } = criteria;
    const where = this.withoutUndefinedKeys({
      target_id: id,
      target_type: type
    });
    return this.table
      .where(where)
      .orderBy('id', 'asc')
      .stream({ batchSize: options.batchSize || defaultBatchSize })
      .pipe(streamMapper(dbEventToEvent));
  }

  public eventsFromTypes(
    types: string[],
    options: { batchSize?: number } = {}
  ): NodeJS.ReadableStream {
    return this.table
      .whereIn('type', types)
      .orderBy('id', 'asc')
      .stream({ batchSize: options.batchSize || defaultBatchSize })
      .pipe(streamMapper(dbEventToEvent));
  }

  private get table() {
    return this.client(this.options.tableName);
  }

  private withoutUndefinedKeys(object: object): object {
    return Object.entries(object).reduce(
      (result, [key, value]) =>
        Object.assign(result, value !== undefined ? { [key]: value } : {}),
      {}
    );
  }
}
