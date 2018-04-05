# createEventStore(connection, options)

* `connection: Connection` - [Connection] information used to connect to database.
* `options?: Object`
  * `tableName?: string` Table name to store events in database. Defaults to `events`.
* returns `EventStore` - An [EventStore] object

Creates an [EventStore] object that can add and find events in database.

Example:

```javascript
const store = createEventStore({
  connectionString: 'postgres://postgres@localhost:5432/eventstore'
});
```

# EventStore class

## store.add(event)

* `event: EventValue` - Event matching [EventValue] to add in store.
* returns: `Promise<Event>` - Contains the added [Event].

Persists the provided event and returns a copy of it with a generated id.

Example:

```javascript
store
  .add({
    type: 'UserSignedUp',
    date: new Date(),
    targetType: 'User',
    targetId: 'bf04b429-4c88-46de-a2ae-15624c75fd56',
    payload: {
      login: 'johndoe'
    }
  })
  .then(() => console.log('Event added'));
```

Full example in [/examples/add.js](/examples/add.js).

## store.addAll(events)

* `events: Array<EventValue>` - Events matching [EventValue] to add in store.
* returns: `Promise<Array<Event>>` - Contains an array with the added [Event] objects which preserves insertion order.

Persists the provided events and returns an array containing copies of them with theirs generated id.

Example:

```javascript
store.addAll([event1, event2, event3]).then(() => console.log('Events added'));
```

Full example in [/examples/addAll.js](/examples/addAll.js).

## store.close()

* returns: `Promise<void>`

Dispose all resources properly like database connection.

Example:

```javascript
store.close().then(() => console.log('Store closed'));
```

## store.find(criteria, options)

* `criteria: Object` - Criteria to select relevant events.
  * `type?: string` - Selects events having the type.
  * `types?: Array<string>` - Selects events having one of the types.
  * `targetId?: string` - Selects events having the target id.
  * `targetType?: string` - Selects events having the target type.
  * `afterId?: number` - Selects events having an id greater than the provided one.
* `options?: Object`
  * `batchSize?: number` - Number of events to load at once from the database. Defaults to 1000.
* returns: `EventEmitter`
  * Emits each relevant [Event] object on `data`.
  * Emits errors on `error`.
  * Emits `end` when all relevant events are emitted.

Finds all events matching criteria using an event emitter for results.

Example:

```javascript
store
  .find({ type: 'UserLoggedIn' })
  .on('data', event => console.log('Event found:', event))
  .on('end', () => console.log('All events found'))
  .on('error', console.error);
```

Full example in [/examples/find.js](/examples/find.js).

## store.onEvent(callback)

* `callback: (event: Event) => void` - Function called with and for each added [Event] object to the store.
* returns `() => void` - Function used to remove the callback from listeners.

Registers a listener to be notified for each added [Event] object to the store.

Example:

```javascript
const removeListener = store.onEvent(event =>
  console.log('Event added:', event.type)
);
// ...
// then later in the code
removeListener();
```

Full example in [/examples/onEvent.js](/examples/onEvent.js).

# createSchema(connection, options)

* `connection: Connection` - [Connection] information used to connect to database.
* `options?: Object`
  * `tableName?: string` - Table name to store events in database. Defaults to `events`.
* returns `Promise<void>`

Creates the [database schema] dedicated to the event store.

Example:

```javascript
createSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema created'));
```

Full example in [/examples/createSchema.js](/examples/createSchema.js).

# dropSchema(connection)

* `connection: Connection` - [Connection] information used to connect to database.
* `options?: Object`
  * `tableName?: string` - Table name to store events in database. Defaults to `events`.

Drops the [database schema] dedicated to the event store.

Example:

```javascript
dropSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema dropped'));
```

Full example in [/examples/dropSchema.js](/examples/dropSchema.js).

# Connection interface

Database connection can be established with following properties:

* `connectionString: string`

# EventValue interface

An EventValue object represents an event to be added and must have following properties:

* `type: string` - The type describing what occurred (e.g. UserLoggedIn, BlogPostDeleted).
* `date: Date` - The date (with time maybe) when the event occurred.
* `targetId?: string` - If the event concerns an entity you can provide it (e.g. uuid as string, `3`, `"apple"`).
* `targetType?: string` - If the event concerns an entity of a given type you can provide it (e.g. User, BlogPost).
* `payload?: Object` - Any data relevant to the event (e.g. `{ name: "John" }`). Should be a plain object since it will be serialized to json.

Example:

```javascript
{
  type: 'UserSignedUp',
  date: new Date(),
  targetType: 'User',
  targetId: 'bf04b429-4c88-46de-a2ae-15624c75fd56',
  payload: {
    login: 'johndoe'
  }
}
```

# Event interface

An Event object represents a stored event and must have following properties:

* `id: string` - A number stored as string (because of max number length). Ids are sequential meaning if an event's id is greater than another event's one, it occurred after the other one.
* `type: string` - See [EventValue].
* `date: Date` - See [EventValue].
* `targetId?: string` - See [EventValue].
* `targetType?: string` - See [EventValue].
* `payload?: Object` - See [EventValue].

Example:

```javascript
{
  id: 13,
  type: 'UserSignedUp',
  date: new Date(),
  targetType: 'User',
  targetId: 'bf04b429-4c88-46de-a2ae-15624c75fd56',
  payload: {
    login: 'johndoe'
  }
}
```

# Database schema

The schema contains a single table named events by default.

The columns are:

* `id: bigserial` The primary key with auto increment
* `date: timestamp with tz`
* `type: varchar(255)`
* `target_type: varchar(255)`
* `target_id: varchar(255)`
* `payload: jsonb`

[eventstore]: #eventstore-class
[connection]: #connection-interface
[eventvalue]: #eventvalue-interface
[event]: #event-interface
[database schema]: #database-schema
