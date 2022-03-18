import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../domain/bookings/BookingErrors';
import { UnexpectedError } from '../../../../framework/error/GenericAppError';

export type DeleteBookingError =
  | BookingNotFoundError
  | InvalidBookingIdError
  | UnexpectedError;
