"use strict";

const { createEventStore } = require("../build");

const connectionString = "postgres://postgres@localhost:5432/eventstoretests";

main();

async function main() {
  let store;
  try {
    store = createEventStore({ connectionString });

    await store.add({
      type: "UserSignedUp",
      date: new Date(),
      targetType: "User",
      targetId: "bf04b429-4c88-46de-a2ae-15624c75fd56",
      payload: {
        login: "johndoe",
      },
    });

    console.log("Event added");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    if (store) {
      await store.close();
    }
  }
}
