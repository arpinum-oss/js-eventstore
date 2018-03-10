'use strict';

const { createEventStore } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

main();

async function main() {
  let eventStore;
  try {
    eventStore = createEventStore({ connectionString });

    await eventStore.add(createEvent({ type: 'UserLoggedIn' }));
    await eventStore.add(createEvent({ type: 'Irrelevant' }));
    await eventStore.add(createEvent({ type: 'UserLoggedIn' }));

    eventStore
      .find({ type: 'UserLoggedIn' })
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
      type: 'UserLoggedIn',
      date: new Date(),
      targetType: 'User',
      targetId: 'bf04b429-4c88-46de-a2ae-15624c75fd56',
      payload: {
        login: 'johndoe'
      }
    },
    data
  );
}
