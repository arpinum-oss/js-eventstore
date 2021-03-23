import { DbEvent, EventValue } from "../types";

const date = new Date();

export function createEvent(): EventValue {
  return {
    type: "SomethingHappened",
    date,
    targetType: "Something",
    targetId: "42",
    payload: {
      thing: 1337,
    },
  };
}

export function createMinimalEvent(): EventValue {
  return {
    type: "SomethingHappened",
    date,
  };
}

export function createAnotherEvent(): EventValue {
  return {
    type: "OtherThingHappened",
    date,
    targetType: "OtherThing",
    targetId: "10",
    payload: {
      thing: 28,
    },
  };
}

export function createDbEvent(override = {}): DbEvent {
  return {
    id: "1",
    type: "SomethingHappened",
    date,
    target_type: "Something",
    target_id: "42",
    payload: {
      thing: 1337,
    },
    ...override,
  };
}
