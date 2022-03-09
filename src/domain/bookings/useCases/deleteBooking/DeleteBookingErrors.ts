import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../entities/BookingErrors';
import { UnexpectedError } from '../../../_shared/GenericAppError';

export type DeleteBookingError =
  | BookingNotFoundError
  | InvalidBookingIdError
  | UnexpectedError;
