import UseCaseError, { UseCaseReasonError } from '../../_shared/UseCaseError';

export class InvalidBookingError extends UseCaseError {
  constructor(errors: Array<any>) {
    super('error', UseCaseReasonError.VALIDATION_ERROR, errors);
  }
}

export class BookingNotFoundError extends UseCaseError {
  constructor(error: string) {
    super('error', UseCaseReasonError.NOT_FOUND_ERROR, [error]);
  }
}

export class InvalidBookingIdError extends UseCaseError {
  constructor(error: string) {
    super('error', UseCaseReasonError.VALIDATION_ERROR, [error]);
  }
}
