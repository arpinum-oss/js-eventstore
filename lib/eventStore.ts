import { wrap } from '@arpinum/promising';
import * as Knex from 'knex';

import {
  assert,
  assertToBeAnEvent,
  assertToBeEventStoreOptions
} from './defending';
import { dbEventToEvent, eventToDbEvent } from './mapping';
import { streamMapper } from './streaming';
import { Event, NewEvent } from './types';

export interface EventStoreOptions {
  tableName?: string;
}

export interface FindCriteria {
  type?: string;
  types?: string[];
  targetId?: string;
  targetType?: string;
  afterId?: number;
}

const defaultBatchSize = 1000;

export class EventStore {
  private client: Knex;
  private options: EventStoreOptions;

  constructor(client: Knex, options?: EventStoreOptions) {
    assert(client, 'client').toBePresent();
    assertToBeEventStoreOptions(options);
    this.client = client;
    this.options = { tableName: 'events', ...options };
  }

  public destroy(): Promise<void> {
    return wrap(() => this.client.destroy())().then(() => undefined);
  }

  public async add(event: NewEvent): Promise<Event> {
    assert(event, 'event').toBePresent();
    assertToBeAnEvent(event, 'event');
    const dbEvent = eventToDbEvent(event);
    const insertedEvents = await this.table.insert(dbEvent).returning('*');
    return dbEventToEvent(insertedEvents[0]);
  }

  public async addAll(events: NewEvent[]): Promise<Event[]> {
    assert(events, 'events').toBePresent();
    assert(events, 'events').toBeAnArray();
    events.forEach((event, i) => assertToBeAnEvent(event, `events[${i}]`));
    if (events.length === 0) {
      return Promise.resolve([]);
    }
    const dbEvents = events.map(eventToDbEvent);
    const insertedEvents = await this.table.insert(dbEvents).returning('*');
    return insertedEvents.map(dbEventToEvent);
  }

  public find(
    criteria: FindCriteria,
    options: { batchSize?: number } = {}
  ): NodeJS.ReadableStream {
    this.validateFindCriteria(criteria);
    const { afterId, targetId, targetType, type, types } = criteria;
    let query = this.table;
    query = afterId ? query.where('id', '>', afterId) : query;
    query = types ? query.whereIn('type', types) : query;
    const where = this.withoutUndefinedKeys({
      type,
      target_id: targetId,
      target_type: targetType
    });
    return query
      .where(where)
      .orderBy('id', 'asc')
      .stream({ batchSize: options.batchSize || defaultBatchSize })
      .pipe(streamMapper(dbEventToEvent));
  }

  private validateFindCriteria(criteria: FindCriteria) {
    assert(criteria, 'criteria')
      .toBePresent()
      .toBeAnObject();
    assert(criteria.type, 'criteria#type').toBeAString();
    assert(criteria.types, 'criteria#types').toBeAnArray();
    (criteria.types || []).forEach((type, i) =>
      assert(type, `criteria#types[${i}]`).toBeAString()
    );
    assert(criteria.targetId, 'criteria#targetId').toBeAString();
    assert(criteria.targetType, 'criteria#targetType').toBeAString();
    assert(criteria.afterId, 'criteria#afterId').toBeAString();
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
