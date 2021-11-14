import { Knex } from 'knex';

const testConfig = {
  client: 'pg',
  connection: {
    database: 'bookings_service_test',
    user: 'postgres',
    password: 'changeme'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations'
  }
};

const config = {
  client: 'pg',
  connection: {
    database: 'bookings_service',
    user: 'postgres',
    password: 'changeme'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations'
  }
};

// const config = {
//   client: 'pg',
//   connection: {
//     database: process.env.POSTGRES_DB,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD
//   },
//   pool: {
//     min: 2,
//     max: 10
//   },
//   migrations: {
//     tableName: 'migrations',
//     directory: 'migrations'
//   }
// };

function getDb(env: string): Knex.Config {
  return env === 'test' ? (testConfig as Knex.Config) : (config as Knex.Config);
}

export default getDb(process.env.NODE_ENV || 'default');
