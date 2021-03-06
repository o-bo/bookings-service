export enum UseCaseReasonError {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
}

interface IUseCaseError {
  type: string;
  reason: UseCaseReasonError;
  errors?: Array<any>;
}

export default abstract class UseCaseError implements IUseCaseError {
  public readonly type: string;

  public readonly reason: UseCaseReasonError;

  public readonly errors?: Array<any>;

  protected constructor(
    type: string,
    reason: UseCaseReasonError,
    errors?: Array<any>
  ) {
    this.type = type;
    this.reason = reason;
    this.errors = errors;
  }
}
