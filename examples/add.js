'use strict';

const { createEventStore } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

main();

async function main() {
  let eventStore;
  try {
    eventStore = createEventStore({ connectionString });

    await eventStore.add({
      type: 'SomethingHappened',
      date: new Date(),
      targetType: 'Something',
      targetId: '42',
      payload: {
        thing: 1337
      }
    });

    console.log('Event added');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    if (eventStore) {
      await eventStore.destroy();
    }
  }
}
