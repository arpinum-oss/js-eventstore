import {
  Connection,
  createClient,
  createSchema as dbCreateSchema,
  dropSchema as dbDropSchema
} from './database';
import {
  assertToBeAConnection,
  assertToBeEventStoreOptions
} from './defending';
import { EventStore, EventStoreOptions } from './eventStore';

export function createEventStore(
  connection: Connection,
  options?: EventStoreOptions
): EventStore {
  assertToBeAConnection(connection);
  assertToBeEventStoreOptions(options);
  const client = createClient(connection);
  return new EventStore(client, options);
}

export async function createSchema(
  connection: Connection
): Promise<void> {
  assertToBeAConnection(connection);
  let client;
  try {
    client = createClient(connection);
    await dbCreateSchema(client);
  } finally {
    if (client) {
      await client.destroy();
    }
  }
}

export async function dropSchema(
  connection: Connection
): Promise<void> {
  assertToBeAConnection(connection);
  let client;
  try {
    client = createClient(connection);
    await dbDropSchema(client);
  } finally {
    await client.destroy();
  }
}
