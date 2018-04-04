import * as Knex from 'knex';

import { EventEmitter } from 'events';
import {
  assert,
  assertToBeAnEvent,
  assertToBeEventStoreOptions
} from './defending';
import { dbEventToEvent, eventToDbEvent } from './mapping';
import { streamMapper } from './streaming';
import { DbEvent, DbEventValue, Event, EventValue } from './types';

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
  private emitter: NodeJS.EventEmitter;

  constructor(client: Knex, options?: EventStoreOptions) {
    assert(client, 'client').toBePresent();
    assertToBeEventStoreOptions(options);
    this.client = client;
    this.options = { tableName: 'events', ...options };
    this.emitter = new EventEmitter();
  }

  public async close(): Promise<void> {
    this.emitter.removeAllListeners();
    await this.client.destroy();
  }

  public async add(event: EventValue): Promise<Event> {
    assert(event, 'event').toBePresent();
    assertToBeAnEvent(event, 'event');
    const dbEvent = eventToDbEvent(event);
    const insertedEvents = await this.insertEventsInDb([dbEvent]);
    const insertedEvent = insertedEvents[0];
    const addedEvent = dbEventToEvent(insertedEvent);
    this.emitter.emit('event', addedEvent);
    return addedEvent;
  }

  public async addAll(events: EventValue[]): Promise<Event[]> {
    assert(events, 'events').toBePresent();
    assert(events, 'events').toBeAnArray();
    events.forEach((event, i) => assertToBeAnEvent(event, `events[${i}]`));
    if (events.length === 0) {
      return Promise.resolve([]);
    }
    const dbEvents = events.map(eventToDbEvent);
    const insertedEvents = await this.insertEventsInDb(dbEvents);
    const addedEvents = insertedEvents.map(dbEventToEvent);
    addedEvents.forEach(addedEvent => this.emitter.emit('event', addedEvent));
    return addedEvents;
  }

  protected async insertEventsInDb(
    dbEvents: DbEventValue[]
  ): Promise<DbEvent[]> {
    const insertedEvents = (await this.table
      .insert(dbEvents)
      .returning('*')) as DbEvent[];
    return insertedEvents;
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
    return this.findInDb(query, where, {
      batchSize: options.batchSize || defaultBatchSize
    }).pipe(streamMapper(dbEventToEvent));
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

  protected findInDb(
    query: Knex.QueryBuilder,
    whereClause: any,
    streamOptions: any
  ): NodeJS.ReadableStream {
    return query
      .where(whereClause)
      .orderBy('id', 'asc')
      .stream({ batchSize: streamOptions.batchSize });
  }

  public onEvent(callback: (event: Event) => void): () => void {
    const localCallback = (data: any) => callback(data);
    this.emitter.on('event', localCallback);
    return () => {
      this.emitter.removeListener('event', localCallback);
    };
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
