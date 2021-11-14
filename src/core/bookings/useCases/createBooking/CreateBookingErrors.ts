import { GenericAppError } from '../../../GenericAppError';
import UseCaseError, { UseCaseReasonError } from '../../../UseCaseError';
import { Result } from '../../../UseCaseResult';

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
