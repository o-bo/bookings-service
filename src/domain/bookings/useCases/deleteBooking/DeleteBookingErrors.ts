import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../entities/BookingErrors';

export type DeleteBookingError = BookingNotFoundError | InvalidBookingIdError;
