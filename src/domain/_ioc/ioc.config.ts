import { Container } from 'inversify';
import { Knex } from 'knex';
import 'reflect-metadata';
import db from '../../infrastructure/spi/storage/postgres';
import Booking from '../bookings/domain/Booking';
import BookingId from '../bookings/domain/BookingId';
import BookingRepository from '../bookings/repositories/BookingRepository';
import IBookingRepository from '../bookings/repositories/IBookingRepository';
import CreateBookingController from '../bookings/useCases/createBooking/CreateBookingController';
import CreateBookingDto from '../bookings/useCases/createBooking/CreateBookingDto';
import { CreateBookingError } from '../bookings/useCases/createBooking/CreateBookingErrors';
import CreateBookingUseCase from '../bookings/useCases/createBooking/CreateBookingUseCase';
import DeleteBookingController from '../bookings/useCases/deleteBooking/DeleteBookingController';
import DeleteBookingDto from '../bookings/useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingError } from '../bookings/useCases/deleteBooking/DeleteBookingErrors';
import DeleteBookingUseCase from '../bookings/useCases/deleteBooking/DeleteBookingUseCase';
import IUseCase from '../_shared/IUseCase';
import Result from '../_shared/Result';
import SERVICE_IDENTIFIER from './identifiers';

let container = new Container();

container.bind<Knex>(SERVICE_IDENTIFIER.KNEX_DB).toConstantValue(db);

container
  .bind<IBookingRepository>(SERVICE_IDENTIFIER.BOOKING_REPOSITORY)
  .to(BookingRepository);

container
  .bind<
    IUseCase<CreateBookingDto, Promise<Result<CreateBookingError, Booking>>>
  >(SERVICE_IDENTIFIER.CREATE_BOOKING_USE_CASE)
  .to(CreateBookingUseCase);

container
  .bind<CreateBookingController>(SERVICE_IDENTIFIER.CREATE_BOOKING_CONTROLLER)
  .to(CreateBookingController);

container
  .bind<
    IUseCase<DeleteBookingDto, Promise<Result<DeleteBookingError, BookingId>>>
  >(SERVICE_IDENTIFIER.DELETE_BOOKING_USE_CASE)
  .to(DeleteBookingUseCase);

container
  .bind<DeleteBookingController>(SERVICE_IDENTIFIER.DELETE_BOOKING_CONTROLLER)
  .to(DeleteBookingController);

export default container;
