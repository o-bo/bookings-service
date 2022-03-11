import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../entities/BookingErrors';
import { UnexpectedError } from '../../../../framework/GenericAppError';

export type DeleteBookingError =
  | BookingNotFoundError
  | InvalidBookingIdError
  | UnexpectedError;
