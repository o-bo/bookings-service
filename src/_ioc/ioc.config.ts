import { Container } from 'inversify';
import { Knex } from 'knex';
import 'reflect-metadata';
import db from '../infrastructure/spi/storage/postgres';
import SERVICE_IDENTIFIER from './identifiers';

let container = new Container();

container.bind<Knex>(SERVICE_IDENTIFIER.KNEX_DB).toConstantValue(db);

export default container;
