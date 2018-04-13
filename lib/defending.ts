import { assert } from '@arpinum/defender';

import { Connection } from './database';
import { EventStoreOptions } from './eventStore';
import { EventValue } from './types';

export function assertToBeAnEvent(event: EventValue, name = 'event') {
  if (absent(event)) {
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
  if (absent(connection)) {
    return;
  }
  assert(connection, name).toBeAnObject();
  assert(connection.connectionString, `${name}#connectionString`).toBeAString();
}

export function assertToBeEventStoreOptions(
  options: EventStoreOptions,
  name = 'options'
) {
  if (absent(options)) {
    return;
  }
  assert(options, name).toBeAnObject();
  assert(options.tableName, `${name}options#tableName`).toBeAString();
}

function absent(value: any) {
  return value === null || value === undefined;
}
