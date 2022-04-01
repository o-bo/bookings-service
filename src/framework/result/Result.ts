export default abstract class Result<ERR, RSLT> {
  public isSuccess: boolean;

  public isFailure: boolean;

  public error?: ERR;

  protected readonly value?: RSLT;

  protected constructor(isSuccess: boolean, error?: any, value?: RSLT) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this.value = value;

    Object.freeze(this);
  }

  public getValue(): RSLT {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead."
      );
    }
    return this.value!;
  }

  public errorValue(): ERR {
    if (!this.isFailure) {
      throw new Error(
        "Can't get the error of an success result. Use 'getValue' instead."
      );
    }
    return this.error!;
  }

  // TODO: type me
  public abstract unwrap(
    successFn?: (arg0?: RSLT) => any,
    errorFn?: (arg0?: ERR) => any
  ): any;

  public abstract map(fn: (arg0?: RSLT | ERR) => any): Result<ERR, any>;
}

export class Ok<RSLT> extends Result<never, RSLT> {
  constructor(value?: RSLT) {
    super(true, null, value);
  }

  map(fn: (arg0?: RSLT) => Result<never, any>): Result<never, any> {
    return new Ok(fn(this.value));
  }

  unwrap(successFn: (arg0?: RSLT) => any): any {
    if (successFn) {
      return successFn(this.value);
    }
    return this.value;
  }
}

export class Fail<ERR, RSLT> extends Result<ERR, never> {
  constructor(err: ERR) {
    super(false, err);
  }

  map(fn: (arg0?: ERR) => any): Result<ERR, any> {
    return new Fail(fn());
  }

  unwrap(successFn: (arg0?: any) => RSLT, errorFn: (arg0?: ERR) => any): any {
    if (errorFn) {
      return errorFn(this.error);
    }
    return this.error;
  }
}

export class CombinedResults<ERR, RSLT> {
  private _result: Result<ERR, any>;

  public constructor(results: Result<any, any>[], errorFn: (arg0: any) => ERR) {
    const errors = results.reduce(
      (acc: any[], result: Result<any, any>) =>
        result.isFailure ? [...acc, result.errorValue()] : acc,
      []
    );

    if (errors.length > 0) {
      this._result = new Fail<ERR, RSLT>(errorFn(errors));
    } else {
      this._result = new Ok<any>();
    }
  }

  get result(): Result<ERR, any> {
    return this._result;
  }
}
