import * as sinon from 'sinon';
import * as Knex from 'knex';

import { EventStore } from './eventStore';
import { createDbEvent, createEvent } from './tests';

describe('Event store', () => {
  let client;
  let eventStore;

  beforeEach(async () => {
    client = {};
    eventStore = new EventStore({} as Knex);
    eventStore.findInDb = () => Promise.resolve([]);
    eventStore.insertEventsInDb = () => Promise.resolve([]);
  });

  describe('on creation', () => {
    it('should assert client is present', () => {
      const create = () => new EventStore(null);

      expect(create).toThrow('client must be present');
    });

    it('should assert options is wellformed defined', () => {
      const create = () => new EventStore(client, 3 as any);

      expect(create).toThrow('options must be an object');
    });
  });

  describe('on add', () => {
    it('should assert event is present', () => {
      const add = eventStore.add(null);

      return add.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('event must be present')
      );
    });

    it('should assert event is wellformed', () => {
      const add = eventStore.add(3);

      return add.then(
        () => Promise.reject(new Error('Should fail')),
        rejection =>
          expect(rejection.message).toEqual('event must be an object')
      );
    });

    it('should emit added event', async () => {
      const emittedEvents = [];
      eventStore.onEvent(event => {
        emittedEvents.push(event);
      });
      eventStore.insertEventsInDb = () =>
        Promise.resolve([createDbEvent({ id: 1 })]);

      await eventStore.add(createEvent());

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].id).toEqual(1);
    });

    it('could stop listening to added events', async () => {
      const emittedEvents = [];
      const removeListener = eventStore.onEvent(event => {
        emittedEvents.push(event);
      });
      eventStore.insertEventsInDb = () =>
        Promise.resolve([createDbEvent({ id: 1 })]);
      removeListener();

      await eventStore.add(createEvent());

      expect(emittedEvents).toHaveLength(0);
    });
  });

  describe('on add all', () => {
    it('should assert events are present', () => {
      const add = eventStore.addAll(null);

      return add.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('events must be present')
      );
    });

    it('should assert events are an array', () => {
      const add = eventStore.addAll(3);

      return add.then(
        () => Promise.reject(new Error('Should fail')),
        rejection =>
          expect(rejection.message).toEqual('events must be an array')
      );
    });

    it('should assert all events are wellformed', () => {
      const add = eventStore.addAll([3]);

      return add.then(
        () => Promise.reject(new Error('Should fail')),
        rejection =>
          expect(rejection.message).toEqual('events[0] must be an object')
      );
    });

    it('should emit added events', async () => {
      const emittedEvents = [];
      eventStore.onEvent(event => {
        emittedEvents.push(event);
      });
      eventStore.insertEventsInDb = () =>
        Promise.resolve([createDbEvent({ id: 1 }), createDbEvent({ id: 2 })]);

      await eventStore.addAll([createEvent(), createEvent()]);

      expect(emittedEvents).toHaveLength(2);
      expect(emittedEvents[0].id).toEqual(1);
      expect(emittedEvents[1].id).toEqual(2);
    });
  });

  describe('on find', () => {
    it('should assert criteria are present', () => {
      const find = () => eventStore.find(3);

      expect(find).toThrow('criteria must be an object');
    });

    it('should assert criteria are an object', () => {
      const find = () => eventStore.find(3);

      expect(find).toThrow('criteria must be an object');
    });

    it('should assert type is a string when defined', () => {
      const find = () => eventStore.find({ type: 3 });

      expect(find).toThrow('criteria#type must be a string');
    });

    it('should assert types are an array when defined', () => {
      const find = () => eventStore.find({ types: 3 });

      expect(find).toThrow('criteria#types must be an array');
    });

    it('should assert types are an array containing strings when defined', () => {
      const find = () => eventStore.find({ types: [3] });

      expect(find).toThrow('criteria#types[0] must be a string');
    });

    it('should assert target id is a string when defined', () => {
      const find = () => eventStore.find({ targetId: 3 });

      expect(find).toThrow('criteria#targetId must be a string');
    });

    it('should assert target type is a string when defined', () => {
      const find = () => eventStore.find({ targetType: 3 });

      expect(find).toThrow('criteria#targetType must be a string');
    });

    it('should assert after id is a string when defined', () => {
      const find = () => eventStore.find({ afterId: 3 });

      expect(find).toThrow('criteria#afterId must be a string');
    });
  });
});
