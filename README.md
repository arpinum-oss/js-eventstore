# @arpinum/eventstore [![Build Status](https://travis-ci.org/arpinum-oss/js-eventstore.svg?branch=master)](https://travis-ci.org/arpinum-oss/js-eventstore)

> We won't really know what will happen until it happens.
> <cite>Helen Thomas</cite>

_@arpinum/eventstore_ contains a simple event store based on PostgreSQL.

The event store allows you to persist events in a database and query them with some criteria like type.

## Installation

```
npm install @arpinum/eventstore --save
```

## Example

```javascript
const connectionString = 'postgres://postgres@localhost:5432/eventstore';
const eventStore = createEventStore({ connectionString });

await eventStore.add({
  type: 'UserSignedUp',
  date: new Date(),
  targetType: 'User',
  targetId: 'bf04b429-4c88-46de-a2ae-15624c75fd56',
  payload: {
    login: 'johndoe'
  }
});

await eventStore
  .find({ type: 'UserSignedUp' })
  .on('data', event => console.log('Event found:', event));
```

## Docs

* [API](docs/api.md)

## License

[MIT](LICENSE)
