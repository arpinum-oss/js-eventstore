import { assert, is } from "@arpinum/defender";

import { Connection } from "./database";
import { EventStoreOptions } from "./eventStore";
import { Event, EventValue } from "./types";

export function assertToBeAnEvent(
  event: EventValue | null | undefined,
  name = "event"
) {
  if (is(event).absent()) {
    return;
  }
  const presentEvent = event as Event;
  assert(presentEvent, name).toBeAnObject();
  assert(presentEvent.type, `${name}#type`).toBePresent();
  assert(presentEvent.type, `${name}#type`).toBeAString();
  assert(presentEvent.date, `${name}#date`).toBePresent();
  assert(presentEvent.date, `${name}#date`).toBeADate();
  assert(presentEvent.payload, `${name}#payload`).toBeAnObject();
  assert(presentEvent.targetType, `${name}#targetType`).toBeAString();
  assert(presentEvent.targetId, `${name}#targetId`).toBeAString();
}

export function assertToBeAConnection(
  connection: Connection,
  name = "connection"
) {
  if (is(connection).absent()) {
    return;
  }
  assert(connection, name).toBeAnObject();
  assert(connection.connectionString, `${name}#connectionString`).toBeAString();
}

export function assertToBeEventStoreOptions(
  options?: EventStoreOptions,
  name = "options"
) {
  if (is(options).absent()) {
    return;
  }
  assert(options, name).toBeAnObject();
  assert(options!.tableName, `${name}options#tableName`).toBeAString();
}
