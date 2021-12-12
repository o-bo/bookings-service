import { GenericAppError } from '../../../_shared/GenericAppError';
import UseCaseResult from '../../../_shared/UseCaseResult';

import { InvalidBookingError } from '../../domain/BookingErrors';

export type CreateBookingError =
  | GenericAppError.UnexpectedError
  | InvalidBookingError
  | UseCaseResult<any>;
