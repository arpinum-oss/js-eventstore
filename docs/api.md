# createEventStore(connection, [options={}])

* `connection` `Object` Connection information used to connect to database. Must match [connection contract].
* `options` `Object`
  * `[tableName]` `string` Table name to store events in database.
* returns `EventStore`

Creates an [EventStore] object that can add and find events in database.

Example:

```javascript
const store = createEventStore({
  connectionString: 'postgres://postgres@localhost:5432/eventstore'
});
```

# EventStore object

## store.add(event)

* `event` `Object` Event to add in store. Must match [event value contract].
* returns: `Promise` Contains the added event matching [event contract].

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

* `events` `Object[]` Events to add in store. They all must match [event value contract].
* returns: `Promise` Contains an array with the added events matching [event contract]. The resulting array preserves insertion order.

Persists the provided events and returns an array containing copies of them with theirs generated id.

Example:

```javascript
store.addAll([event1, event2, event3]).then(() => console.log('Events added'));
```

Full example in [/examples/addAll.js](/examples/addAll.js).

## store.close()

Dispose all resources properly like database connection.

Example:

```javascript
store.close().then(() => console.log('Store closed'));
```

## store.find(criteria, options)

* `criteria` `Object`
  * `type` `string`
  * `types` `string[]`
  * `targetId` `string`
  * `targetType` `string`
  * `afterId` `number`
* `options` `Object`
  * `batchSize` `number` Defaults to 1000.

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

# createSchema(connection)

* `connection` `Object` Connection information used to connect to database. Must match [connection contract].

Example:

```javascript
createSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema created'));
```

Full example in [/examples/createSchema.js](/examples/createSchema.js).

# dropSchema(connection)

* `connection` `Object` Connection information used to connect to database. Must match [connection contract].

Example:

```javascript
dropSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema dropped'));
```

Full example in [/examples/dropSchema.js](/examples/dropSchema.js).

# Connection contract

Database connection can be established with following properties:

* `connectionString` `string`

[eventstore]: #eventstore-object
[event contract]: #event-contract
[event value contract]: #eventvalue-contract
[connection contract]: #connection-contract
