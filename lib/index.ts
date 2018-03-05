import {
  ClientCreation,
  createClient,
  createSchema as dbCreateSchema,
  dropSchema as dbDropSchema
} from './database';
import {
  assertToBeAClientCreation,
  assertToBeEventStoreOptions
} from './defending';
import { EventStore, EventStoreOptions } from './eventStore';

export function createEventStore(
  clientCreation: ClientCreation,
  options?: EventStoreOptions
): EventStore {
  assertToBeAClientCreation(clientCreation);
  assertToBeEventStoreOptions(options);
  const client = createClient(clientCreation);
  return new EventStore(client, options);
}

export async function createSchema(
  clientCreation: ClientCreation
): Promise<void> {
  assertToBeAClientCreation(clientCreation);
  const client = createClient(clientCreation);
  await dbCreateSchema(client);
  await client.destroy();
}

export async function dropSchema(
  clientCreation: ClientCreation
): Promise<void> {
  assertToBeAClientCreation(clientCreation);
  const client = createClient(clientCreation);
  await dbDropSchema(client);
  await client.destroy();
}
