# @arpinum/eventstore [![Build Status](https://github.com/arpinum-oss/js-eventstore/workflows/CI/badge.svg)](https://github.com/arpinum-oss/js-eventstore/actions?query=workflow%3ACI)

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
const connectionString = "postgres://postgres@localhost:5432/eventstore";
const store = createEventStore({ connectionString });

await store.add({
  type: "UserSignedUp",
  date: new Date(),
  targetType: "User",
  targetId: "bf04b429-4c88-46de-a2ae-15624c75fd56",
  payload: {
    login: "johndoe",
  },
});

await store
  .find({ type: "UserSignedUp" })
  .on("data", (event) => console.log("Event found:", event));
```

More examples in [examples](examples).

## Docs

- [API](docs/api.md)

## License

[MIT](LICENSE)
