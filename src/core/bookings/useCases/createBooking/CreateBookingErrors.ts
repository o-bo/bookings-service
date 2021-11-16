import { GenericAppError } from '../../../_shared/GenericAppError';
import UseCaseError, {
  UseCaseReasonError
} from '../../../_shared/UseCaseError';
import Result from '../../../_shared/UseCaseResult';

export class InvalidBookingError extends Result<UseCaseError> {
  constructor(errors: Array<any>) {
    super(false, {
      type: 'error',
      reason: UseCaseReasonError.VALIDATION_ERROR,
      errors
    } as UseCaseError);
  }
}

export type CreateBookingError =
  | GenericAppError.UnexpectedError
  | InvalidBookingError
  | Result<any>;
