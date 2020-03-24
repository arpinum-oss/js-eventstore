import * as Knex from "knex";

export interface Connection {
  connectionString: string;
}

export function createClient(connection: Connection): Knex {
  const { connectionString } = connection;
  return Knex({
    client: "pg",
    connection: connectionString,
  });
}

export async function createSchema(
  client: Knex,
  options?: { tableName?: string }
): Promise<void> {
  const { tableName } = { tableName: "events", ...options };
  await client.transaction((trx) =>
    trx.schema.createTable(tableName, (table) => {
      table.bigIncrements("id");
      table.dateTime("date");
      table.string("type").index();
      table.string("target_type").index();
      table.string("target_id").index();
      table.jsonb("payload");
    })
  );
}

export async function dropSchema(
  client: Knex,
  options?: { tableName?: string }
): Promise<void> {
  const { tableName } = { tableName: "events", ...options };
  await client.transaction((trx) => trx.schema.dropTable(tableName));
}
