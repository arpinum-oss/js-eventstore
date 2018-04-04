import * as Knex from 'knex';

export interface Connection {
  connectionString: string;
}

export function createClient(connection: Connection): Knex {
  const { connectionString } = connection;
  return Knex({
    client: 'pg',
    connection: connectionString
  });
}

export function createSchema(client: Knex) {
  return client.schema.createTable('events', table => {
    table.bigIncrements('id');
    table.dateTime('date');
    table.string('type').index();
    table.string('target_type').index();
    table.string('target_id').index();
    table.jsonb('payload');
  });
}

export function dropSchema(client: Knex) {
  return client.schema.dropTable('events');
}
