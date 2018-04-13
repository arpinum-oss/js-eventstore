import { assert, is } from '@arpinum/defender';

import { Connection } from './database';
import { EventStoreOptions } from './eventStore';
import { EventValue } from './types';

export function assertToBeAnEvent(event: EventValue, name = 'event') {
  if (is(event).absent()) {
    return;
  }
  assert(event, name).toBeAnObject();
  assert(event.type, `${name}#type`).toBePresent();
  assert(event.type, `${name}#type`).toBeAString();
  assert(event.date, `${name}#date`).toBePresent();
  assert(event.date, `${name}#date`).toBeADate();
  assert(event.payload, `${name}#payload`).toBeAnObject();
  assert(event.targetType, `${name}#targetType`).toBeAString();
  assert(event.targetId, `${name}#targetId`).toBeAString();
}

export function assertToBeAConnection(
  connection: Connection,
  name = 'connection'
) {
  if (is(connection).absent()) {
    return;
  }
  assert(connection, name).toBeAnObject();
  assert(connection.connectionString, `${name}#connectionString`).toBeAString();
}

export function assertToBeEventStoreOptions(
  options: EventStoreOptions,
  name = 'options'
) {
  if (is(options).absent()) {
    return;
  }
  assert(options, name).toBeAnObject();
  assert(options.tableName, `${name}options#tableName`).toBeAString();
}
