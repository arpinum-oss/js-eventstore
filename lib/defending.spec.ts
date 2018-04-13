import * as sinon from 'sinon';

import { Connection } from './database';
import * as defending from './defending';
import { assertToBeEventStoreOptions } from './defending';
import { createEvent } from './tests';
import { EventValue } from './types';

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
        defending.assertToBeAnEvent((3 as any) as EventValue);

      expect(assertion).toThrow('event must be an object');
    });

    it('should require type to be present', () => {
      const event = Object.assign({}, createEvent(), { type: undefined });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#type must be present');
    });

    it('should require type to be a string', () => {
      const event = Object.assign({}, createEvent(), { type: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#type must be a string');
    });

    it('should require date to be present', () => {
      const event = Object.assign({}, createEvent(), { date: undefined });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#date must be present');
    });

    it('should require date to be a date', () => {
      const event = Object.assign({}, createEvent(), { date: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#date must be a date');
    });

    it('should allow missing payload', () => {
      const event = Object.assign({}, createEvent(), { payload: undefined });

      defending.assertToBeAnEvent(event as EventValue);
    });

    it('should require payload to be an object', () => {
      const event = Object.assign({}, createEvent(), { payload: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#payload must be an object');
    });

    it('should allow missing target type', () => {
      const event = Object.assign({}, createEvent(), { targetType: undefined });

      defending.assertToBeAnEvent(event as EventValue);
    });

    it('should require target type to be a string', () => {
      const event = Object.assign({}, createEvent(), { targetType: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

      expect(assertion).toThrow('event#targetType must be a string');
    });

    it('should allow missing target id', () => {
      const event = Object.assign({}, createEvent(), { targetId: undefined });

      defending.assertToBeAnEvent(event as EventValue);
    });

    it('should require target id to be a string', () => {
      const event = Object.assign({}, createEvent(), { targetId: 3 });

      const assertion = () => defending.assertToBeAnEvent(event as EventValue);

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

  describe('on assert to be a connection', () => {
    it('should do nothing when value is absent', () => {
      defending.assertToBeEventStoreOptions(null);
    });

    it('should do nothing when connection is valid', () => {
      defending.assertToBeAConnection({ connectionString: 'connec' });
    });

    it('should require connection to be an object', () => {
      const assertion = () =>
        defending.assertToBeAConnection((3 as any) as Connection);

      expect(assertion).toThrow('connection must be an object');
    });

    it('should require connection string to be a string', () => {
      const assertion = () =>
        defending.assertToBeAConnection({
          connectionString: 3 as any
        } as Connection);

      expect(assertion).toThrow('connection#connectionString must be a string');
    });
  });
});
