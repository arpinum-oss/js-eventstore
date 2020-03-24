"use strict";

const { createEventStore } = require("../build");

const connectionString = "postgres://postgres@localhost:5432/eventstoretests";

main();

async function main() {
  let store;
  try {
    store = createEventStore({ connectionString });

    await store.addAll([createEvent(), createEvent(), createEvent()]);

    console.log("Events added");
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
      type: "UserLoggedIn",
      date: new Date(),
      targetType: "User",
      targetId: "bf04b429-4c88-46de-a2ae-15624c75fd56",
      payload: {
        login: "johndoe",
      },
    },
    data
  );
}
