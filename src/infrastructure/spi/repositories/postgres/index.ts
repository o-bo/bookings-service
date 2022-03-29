import { Knex, knex } from 'knex';
import { types } from 'pg';

/* Fix : Override date parser to avoid returning a full ISO8061 string representation https://github.com/knex/knex/issues/3071 */
const DATE_OID = 1082;
const parseDate = (value: string): any => value;
types.setTypeParser(DATE_OID, parseDate);
/* /Fix */

import dbConfig from './knexfile';

const db: Knex = knex(dbConfig);

export default db;
