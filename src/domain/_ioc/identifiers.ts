export default {
  KNEX_DB: Symbol.for('KnexDb'),
  BOOKING_REPOSITORY: Symbol.for('BookingRepository'),
  CREATE_BOOKING_CONTROLLER: Symbol.for('CreateBookingController'),
  CREATE_BOOKING_USE_CASE: Symbol.for('CreateBookingUseCase'),
  DELETE_BOOKING_CONTROLLER: Symbol.for('DeleteBookingController'),
  DELETE_BOOKING_USE_CASE: Symbol.for('DeleteBookingUseCase')
};
