export default class Result<ERR, RSLT> {
  public isSuccess: boolean;

  public isFailure: boolean;

  public error?: ERR;

  private value?: RSLT;

  public constructor(isSuccess: boolean, error?: any, value?: RSLT) {
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

  public errorValue(): any {
    return this.error;
  }

  public static ok<ERR, RSLT>(value?: RSLT): Result<ERR, RSLT> {
    return new Result<ERR, RSLT>(true, null, value);
  }

  public static fail<ERR, RSLT>(error: any): Result<ERR, RSLT> {
    return new Result<ERR, RSLT>(false, error);
  }

  public static combine(results: Result<any, any>[]): Result<any, any> {
    const errors = [];
    for (let result of results) {
      if (result.isFailure) errors.push(result.errorValue());
    }
    if (errors.length > 0) {
      return Result.fail(errors);
    } else {
      return Result.ok();
    }
  }
}
