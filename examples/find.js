'use strict';

const { createEventStore } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

main();

async function main() {
  let eventStore;
  try {
    eventStore = createEventStore({ connectionString });

    await eventStore.add(createEvent({ type: 'SomethingHappened' }));
    await eventStore.add(createEvent({ type: 'Irrelevant' }));
    await eventStore.add(createEvent({ type: 'SomethingHappened' }));

    eventStore
      .find({ type: 'SomethingHappened' })
      .on('data', event => console.log('Event found:', event))
      .on('end', () => console.log('All events found'))
      .on('error', console.error);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    if (eventStore) {
      await eventStore.destroy();
    }
  }
}

function createEvent(data) {
  return Object.assign(
    {},
    {
      type: 'SomethingHappened',
      date: new Date(),
      targetType: 'Something',
      targetId: '42',
      payload: {
        thing: 1337
      }
    },
    data
  );
}
