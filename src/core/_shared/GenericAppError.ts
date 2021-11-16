import Result from './UseCaseResult';
import UseCaseError, { UseCaseReasonError } from './UseCaseError';

export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, {
        type: 'error',
        reason: UseCaseReasonError.UNEXPECTED_ERROR,
        errors: err
      } as UseCaseError);
      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
