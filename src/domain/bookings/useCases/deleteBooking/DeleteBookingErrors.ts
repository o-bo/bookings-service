import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';

export type DeleteBookingError = BookingNotFoundError | InvalidBookingIdError;
