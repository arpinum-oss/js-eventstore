'use strict';

const { dropSchema } = require('../build');

const connectionString = 'postgres://postgres@localhost:5432/eventstoretests';

dropSchema({ connectionString })
  .then(() => console.log('Schema dropped'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
