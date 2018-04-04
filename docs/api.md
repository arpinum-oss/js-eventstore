# createEventStore(clientCreation, options)

Example:

```javascript
const store = createEventStore({
  connectionString: 'postgres://postgres@localhost:5432/eventstore'
});
```

# EventStore object

## store.add(event)

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

Example:

```javascript
store.addAll([event1, event2, event3]).then(() => console.log('Events added'));
```

Full example in [/examples/addAll.js](/examples/addAll.js).

## store.close()

Example:

```javascript
store.close().then(() => console.log('Store closed'));
```

## store.find(criteria, options)

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

# createSchema(clientCreation)

Example:

```javascript
createSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema created'));
```

Full example in [/examples/createSchema.js](/examples/createSchema.js).

# dropSchema(clientCreation)

Example:

```javascript
dropSchema({
  connectionString: 'postgres://postgres@localhost:5432/eventstoretests'
}).then(() => console.log('Schema dropped'));
```

Full example in [/examples/dropSchema.js](/examples/dropSchema.js).
