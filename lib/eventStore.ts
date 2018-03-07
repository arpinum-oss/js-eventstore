import { wrap } from '@arpinum/promising';
import * as Knex from 'knex';

import { EventEmitter } from 'events';
import {
  assert,
  assertToBeAnEvent,
  assertToBeEventStoreOptions
} from './defending';
import { dbEventToEvent, eventToDbEvent } from './mapping';
import { streamMapper } from './streaming';
import { DbEvent, Event, NewDbEvent, NewEvent } from './types';

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

  public destroy(): Promise<void> {
    this.emitter.removeAllListeners();
    return wrap(() => this.client.destroy())().then(() => undefined);
  }

  public async add(event: NewEvent): Promise<Event> {
    assert(event, 'event').toBePresent();
    assertToBeAnEvent(event, 'event');
    const dbEvent = eventToDbEvent(event);
    const insertedEvents = await this.insertEvents([dbEvent]);
    const insertedEvent = insertedEvents[0];
    const addedEvent = dbEventToEvent(insertedEvent);
    this.emitter.emit('event', addedEvent);
    return addedEvent;
  }

  public async addAll(events: NewEvent[]): Promise<Event[]> {
    assert(events, 'events').toBePresent();
    assert(events, 'events').toBeAnArray();
    events.forEach((event, i) => assertToBeAnEvent(event, `events[${i}]`));
    if (events.length === 0) {
      return Promise.resolve([]);
    }
    const dbEvents = events.map(eventToDbEvent);
    const insertedEvents = await this.insertEvents(dbEvents);
    const addedEvents = insertedEvents.map(dbEventToEvent);
    addedEvents.forEach(addedEvent => this.emitter.emit('event', addedEvent));
    return addedEvents;
  }

  protected async insertEvents(dbEvents: NewDbEvent[]): Promise<DbEvent[]> {
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
    return query
      .where(where)
      .orderBy('id', 'asc')
      .stream({ batchSize: options.batchSize || defaultBatchSize })
      .pipe(streamMapper(dbEventToEvent));
  }

  public onEvent(callback: (event: Event) => void) {
    const localCallback = (data: any) => callback(data);
    this.emitter.on('event', localCallback);
    return () => this.emitter.removeListener('event', localCallback);
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
