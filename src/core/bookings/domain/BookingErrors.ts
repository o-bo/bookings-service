import UseCaseError, { UseCaseReasonError } from '../../_shared/UseCaseError';
import UseCaseResult from '../../_shared/UseCaseResult';

export class InvalidBookingError extends UseCaseResult<UseCaseError> {
  constructor(errors: Array<any>) {
    super(false, {
      type: 'error',
      reason: UseCaseReasonError.VALIDATION_ERROR,
      errors
    } as UseCaseError);
  }
}

export class BookingNotFoundError extends UseCaseResult<UseCaseError> {
  constructor(error: string) {
    super(false, {
      type: 'error',
      reason: UseCaseReasonError.NOT_FOUND_ERROR,
      error
    } as UseCaseError);
  }
}

export class InvalidBookingIdError extends UseCaseResult<UseCaseError> {
  constructor(error: string) {
    super(false, {
      type: 'error',
      reason: UseCaseReasonError.VALIDATION_ERROR,
      error
    } as UseCaseError);
  }
}
