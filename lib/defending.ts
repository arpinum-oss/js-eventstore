import { Connection } from './database';
import { EventStoreOptions } from './eventStore';
import { EventValue } from './types';

export class Assert {
  private name: string;
  private value: any;

  constructor(value: any, name: string) {
    this.value = value;
    this.name = name;
  }

  public toBePresent() {
    if (absent(this.value)) {
      throw new Error(`${this.name} must be present`);
    }
    return this;
  }

  public toBeAbsent() {
    if (!absent(this.value)) {
      throw new Error(`${this.name} must be absent`);
    }
    return this;
  }

  public toBeAString() {
    if (notA('string', this.value)) {
      throw new Error(`${this.name} must be a string`);
    }
    return this;
  }

  public toBeANumber() {
    if (notA('number', this.value)) {
      throw new Error(`${this.name} must be a number`);
    }
    return this;
  }

  public toBeADate() {
    if (notADate(this.value)) {
      throw new Error(`${this.name} must be a date`);
    }
    return this;
  }

  public toBeAnArray() {
    if (notAnArray(this.value)) {
      throw new Error(`${this.name} must be an array`);
    }
    return this;
  }

  public toBeAnObject() {
    if (notA('object', this.value)) {
      throw new Error(`${this.name} must be an object`);
    }
    return this;
  }
}

export function assert(value: any, name = 'value'): Assert {
  return new Assert(value, name);
}

export function assertToBeAnEvent(event: EventValue, name = 'event') {
  if (absent(event)) {
    return;
  }
  assert(event, name).toBeAnObject();
  assert(event.type, `${name}#type`).toBePresent();
  assert(event.type, `${name}#type`).toBeAString();
  assert(event.date, `${name}#date`).toBePresent();
  assert(event.date, `${name}#date`).toBeADate();
  assert(event.payload, `${name}#payload`).toBeAnObject();
  assert(event.targetType, `${name}#targetType`).toBeAString();
  assert(event.targetId, `${name}#targetId`).toBeAString();
}

export function assertToBeAConnection(
  connection: Connection,
  name = 'connection'
) {
  if (absent(connection)) {
    return;
  }
  assert(connection, name).toBeAnObject();
  assert(
    connection.connectionString,
    `${name}#connectionString`
  ).toBeAString();
}

export function assertToBeEventStoreOptions(
  options: EventStoreOptions,
  name = 'options'
) {
  if (absent(options)) {
    return;
  }
  assert(options, name).toBeAnObject();
  assert(options.tableName, `${name}options#tableName`).toBeAString();
}

function notA(type: string, value: any) {
  return present(value) && typeof value !== type;
}

function notADate(value: any) {
  return (
    present(value) && Object.prototype.toString.call(value) !== '[object Date]'
  );
}

function notAnArray(value: any) {
  return present(value) && !Array.isArray(value);
}

function absent(value: any) {
  return value === null || value === undefined;
}

function present(value: any) {
  return !absent(value);
}
