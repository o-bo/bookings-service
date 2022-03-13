import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../domain/bookings/BookingErrors';
import { UnexpectedError } from '../../../../framework/GenericAppError';

export type DeleteBookingError =
  | BookingNotFoundError
  | InvalidBookingIdError
  | UnexpectedError;
