import UseCaseError, { UseCaseReasonError } from './UseCaseError';

export class UnexpectedError extends UseCaseError {
  public constructor(err: any) {
    super('error', UseCaseReasonError.UNEXPECTED_ERROR, err);
    // console.log(`[AppError]: An unexpected error occurred`);
    // console.error(err);
  }
}
