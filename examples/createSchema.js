'use strict';

const { createSchema } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

createSchema({ connectionString })
  .then(() => console.log('Schema created'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
