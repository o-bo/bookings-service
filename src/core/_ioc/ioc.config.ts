import { Container } from 'inversify';
import 'reflect-metadata';
import { Knex } from 'knex';

import IUseCase from '../_shared/IUseCase';

import SERVICE_IDENTIFIER from './identifiers';

import db from '../../infrastructure/spi/storage/postgres';

import IBookingRepository from '../bookings/repositories/IBookingRepository';
import BookingRepository from '../bookings/repositories/BookingRepository';
import CreateBookingController from '../bookings/useCases/createBooking/CreateBookingController';
import CreateBookingDto from '../bookings/useCases/createBooking/CreateBookingDto';
import { CreateBookingResponse } from '../bookings/useCases/createBooking/CreateBookingResponse';
import CreateBookingUseCase from '../bookings/useCases/createBooking/CreateBookingUseCase';
import DeleteBookingController from '../bookings/useCases/deleteBooking/DeleteBookingController';
import DeleteBookingDto from '../bookings/useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingResponse } from '../bookings/useCases/deleteBooking/DeleteBookingResponse';
import DeleteBookingUseCase from '../bookings/useCases/deleteBooking/DeleteBookingUseCase';

let container = new Container();

container.bind<Knex>(SERVICE_IDENTIFIER.KNEX_DB).toConstantValue(db);

container
  .bind<IBookingRepository>(SERVICE_IDENTIFIER.BOOKING_REPOSITORY)
  .to(BookingRepository);

container
  .bind<IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>>(
    SERVICE_IDENTIFIER.CREATE_BOOKING_USE_CASE
  )
  .to(CreateBookingUseCase);

container
  .bind<CreateBookingController>(SERVICE_IDENTIFIER.CREATE_BOOKING_CONTROLLER)
  .to(CreateBookingController);

container
  .bind<IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>>(
    SERVICE_IDENTIFIER.DELETE_BOOKING_USE_CASE
  )
  .to(DeleteBookingUseCase);

container
  .bind<DeleteBookingController>(SERVICE_IDENTIFIER.DELETE_BOOKING_CONTROLLER)
  .to(DeleteBookingController);

export default container;
