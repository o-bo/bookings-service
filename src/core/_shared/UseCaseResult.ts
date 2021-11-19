export default class UseCaseResult<RSLT> {
  public isSuccess: boolean;

  public isFailure: boolean;

  public error?: any;

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

  public static ok<RSLT>(value?: RSLT): UseCaseResult<RSLT> {
    return new UseCaseResult<RSLT>(true, null, value);
  }

  public static fail<RSLT>(error: any): UseCaseResult<RSLT> {
    return new UseCaseResult<RSLT>(false, error);
  }

  public static combine(results: UseCaseResult<any>[]): UseCaseResult<any> {
    const errors = [];
    for (let result of results) {
      if (result.isFailure) errors.push(result.errorValue());
    }
    if (errors.length > 0) {
      return UseCaseResult.fail(errors);
    } else {
      return UseCaseResult.ok();
    }
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  cata(fnLeft: (l: L) => any) {
    return fnLeft(this.value);
  }
}

export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  cata(_: (l: L) => any, fnRight: (r: R) => any) {
    return fnRight(this.value);
  }
}

export const left = <L, R>(l: L): Either<L, R> => {
  return new Left(l);
};

export const right = <L, R>(a: R): Either<L, R> => {
  return new Right<L, R>(a);
};
