const date = new Date();

export function createEvent() {
  return {
    type: 'SomethingHappened',
    date,
    targetType: 'Something',
    targetId: '42',
    payload: {
      thing: 1337
    }
  };
}

export function createMinimalEvent() {
  return {
    type: 'SomethingHappened',
    date
  };
}

export function createAnotherEvent() {
  return {
    type: 'OtherThingHappened',
    date,
    targetType: 'OtherThing',
    targetId: '10',
    payload: {
      thing: 28
    }
  };
}

export function createDbEvent(override = {}) {
  return {
    type: 'SomethingHappened',
    date,
    target_type: 'Something',
    target_id: '42',
    payload: {
      thing: 1337
    },
    ...override
  };
}
