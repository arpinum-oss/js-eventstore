'use strict';

const { createEventStore } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

main();

async function main() {
  let store;
  try {
    store = createEventStore({ connectionString });

    const removeListener = store.onEvent(event =>
      console.log('Event added:', event.type)
    );

    await store.add(createEvent({ type: 'UserSignedUp' }));
    await store.add(createEvent({ type: 'UserLoggedIn' }));
    await store.add(createEvent({ type: 'UserLoggedOut' }));

    removeListener();

    await store.add(createEvent({ type: 'NoMoreRegistered' }));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    if (store) {
      await store.close();
    }
  }
}

function createEvent(data) {
  return Object.assign(
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
