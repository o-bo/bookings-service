import { GenericAppError } from '../../../_shared/GenericAppError';
import UseCaseResult from '../../../_shared/UseCaseResult';

import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';

export type DeleteBookingError =
  | GenericAppError.UnexpectedError
  | BookingNotFoundError
  | InvalidBookingIdError
  | UseCaseResult<any>;
