import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../domain/BookingErrors';
import { UnexpectedError } from '../../../../../framework/error/GenericAppError';

export type DeleteBookingError =
  | BookingNotFoundError
  | InvalidBookingIdError
  | UnexpectedError;
