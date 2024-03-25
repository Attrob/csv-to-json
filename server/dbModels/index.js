const knex = require('knex');

const database = knex({
  client: 'pg',
  connection: {
    host: process.env.DBHOST || "localhost",
    database: process.env.DATABASE || "csv_json",
    user: process.env.DBUSER || "postgres",
    password: process.env.DBPASSWORD || "postgres",
    port: process.env.DBPORT || 5432
  },
});

database.on('query', (queryData) => {
  if (queryData && queryData.sql != "SELECT 1")
    console.log(`Query executed: ${JSON.stringify(queryData.sql)}`);
});

database.raw('SELECT 1')
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Error connecting to database:', error));

module.exports = database;
