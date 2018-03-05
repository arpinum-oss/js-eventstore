import * as sinon from 'sinon';

export * from './samples';

export const connectionString =
  'postgres://postgres@localhost:5432/eventstoretests';

export function createFakeClient() {
  const client: any = () => client;
  client.destroy = sinon.stub().returns(Promise.resolve());
  client.table = client;
  client.insert = client;
  client.returning = client;
  client.query = client;
  client.where = client;
  client.whereIn = client;
  client.orderBy = client;
  client.stream = client;
  client.pipe = client;
  return client;
}
