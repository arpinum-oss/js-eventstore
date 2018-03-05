import * as sinon from 'sinon';

import { ClientCreation } from './database';
import * as defending from './defending';
import { assert, assertToBeEventStoreOptions } from './defending';
import { createEvent } from './tests';
import { NewEvent } from './types';

describe('When asserting', () => {
  describe('with a custom name', () => {
    it('should use it for error messages', () => {
      const assertion = () => assert(null, 'moon').toBePresent();

      expect(assertion).toThrow('moon must be present');
    });
  });

  describe('to be present', () => {
    it('should do nothing when value is neither null nor undefined', () => {
      assert(3).toBePresent();
      assert('hello').toBePresent();
      assert(0).toBePresent();
      assert('').toBePresent();
      assert({}).toBePresent();
      assert([]).toBePresent();
    });

    it('should throw if value is null', () => {
      const assertion = () => assert(null).toBePresent();

      expect(assertion).toThrow('value must be present');
    });

    it('should throw if value is undefined', () => {
      const assertion = () => assert(undefined).toBePresent();

      expect(assertion).toThrow('value must be present');
    });
  });

  describe('to be absent', () => {
    it('should do nothing when value is null or undefined', () => {
      assert(null).toBeAbsent();
      assert(undefined).toBeAbsent();
    });

    it('should throw if value is present', () => {
      const assertion = () => assert(3).toBeAbsent();

      expect(assertion).toThrow('value must be absent');
    });
  });

  describe('to be a string', () => {
    it('should do nothing when value is a string', () => {
      assert('hello').toBeAString();
      assert('').toBeAString();
    });

    it('should do nothing when value is a absent', () => {
      assert(null).toBeAString();
    });

    it('should require value to be a string', () => {
      const assertion = () => assert(3).toBeAString();

      expect(assertion).toThrow('value must be a string');
    });
  });

  describe('to be a number', () => {
    it('should do nothing when value is a number', () => {
      assert(3).toBeANumber();
      assert(0).toBeANumber();
    });

    it('should do nothing when value is a absent', () => {
      assert(null).toBeANumber();
    });

    it('should require value to be a number', () => {
      const assertion = () => assert('3').toBeANumber();

      expect(assertion).toThrow('value must be a number');
    });
  });

  describe('to be a date', () => {
    it('should do nothing when value is a date', () => {
      assert(new Date()).toBeADate();
    });

    it('should do nothing when value is a absent', () => {
      assert(null).toBeADate();
    });

    it('should require value to be a date', () => {
      const assertion = () => assert(3).toBeADate();

      expect(assertion).toThrow('value must be a date');
    });
  });

  describe('to be an array', () => {
    it('should do nothing when value is an array', () => {
      assert([1, 2]).toBeAnArray();
      assert([]).toBeAnArray();
    });

    it('should do nothing when value is a absent', () => {
      assert(null).toBeAnArray();
    });

    it('should require value to be an array', () => {
      const assertion = () => assert(3).toBeAnArray();

      expect(assertion).toThrow('value must be an array');
    });
  });

  describe('to be an object', () => {
    it('should do nothing when value is an object', () => {
      assert({ test: 'ok' }).toBeAnObject();
      assert({}).toBeAnObject();
    });

    it('should do nothing when value is a absent', () => {
      assert(null).toBeAnObject();
    });

    it('should require value to be an object', () => {
      const assertion = () => assert(3).toBeAnObject();

      expect(assertion).toThrow('value must be an object');
    });
  });
});

describe('Defending module', () => {
  describe('on assert to be an event', () => {
    it('should do nothing when event is absent', () => {
      defending.assertToBeAnEvent(null);
    });

    it('should do nothing when event is valid', () => {
      defending.assertToBeAnEvent(createEvent());
    });

    it('should require event to be an object', () => {
      const assertion = () =>
        defending.assertToBeAnEvent((3 as any) as NewEvent);

      expect(assertion).toThrow('event must be an object');
    });

    it('should require type to be present', () => {
      const event = Object.assign({}, createEvent(), { type: undefined });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#type must be present');
    });

    it('should require type to be a string', () => {
      const event = Object.assign({}, createEvent(), { type: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#type must be a string');
    });

    it('should require date to be present', () => {
      const event = Object.assign({}, createEvent(), { date: undefined });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#date must be present');
    });

    it('should require date to be a date', () => {
      const event = Object.assign({}, createEvent(), { date: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#date must be a date');
    });

    it('should allow missing payload', () => {
      const event = Object.assign({}, createEvent(), { payload: undefined });

      defending.assertToBeAnEvent(event as NewEvent);
    });

    it('should require payload to be an object', () => {
      const event = Object.assign({}, createEvent(), { payload: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#payload must be an object');
    });

    it('should allow missing target type', () => {
      const event = Object.assign({}, createEvent(), { targetType: undefined });

      defending.assertToBeAnEvent(event as NewEvent);
    });

    it('should require target type to be a string', () => {
      const event = Object.assign({}, createEvent(), { targetType: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#targetType must be a string');
    });

    it('should allow missing target id', () => {
      const event = Object.assign({}, createEvent(), { targetId: undefined });

      defending.assertToBeAnEvent(event as NewEvent);
    });

    it('should require target id to be a string', () => {
      const event = Object.assign({}, createEvent(), { targetId: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as NewEvent);

      expect(assertion).toThrow('event#targetId must be a string');
    });
  });

  describe('on assert to be event store options', () => {
    it('should do nothing when value is absent', () => {
      defending.assertToBeEventStoreOptions(null);
    });

    it('should allow minimal information', () => {
      defending.assertToBeEventStoreOptions({});
    });

    it('should assert table name is a string when defined', () => {
      const assertion = () =>
        defending.assertToBeEventStoreOptions({ tableName: 3 as any });

      expect(assertion).toThrow('options#tableName must be a string');
    });
  });

  describe('on assert to be a client creation', () => {
    it('should do nothing when value is absent', () => {
      defending.assertToBeEventStoreOptions(null);
    });

    it('should do nothing when client creation is valid', () => {
      defending.assertToBeAClientCreation({ connectionString: 'connec' });
    });

    it('should require client creation to be an object', () => {
      const assertion = () =>
        defending.assertToBeAClientCreation((3 as any) as ClientCreation);

      expect(assertion).toThrow('clientCreation must be an object');
    });

    it('should require connection string to be a string', () => {
      const assertion = () =>
        defending.assertToBeAClientCreation({
          connectionString: 3 as any
        } as ClientCreation);

      expect(assertion).toThrow(
        'clientCreation#connectionString must be a string'
      );
    });
  });
});
