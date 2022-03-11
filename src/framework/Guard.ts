import { validate } from 'uuid';

export interface IGuardResult {
  succeeded?: true;
  failed?: true;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export default class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.failed) return result;
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        failed: true,
        message: `${argumentName} is required`
      };
    } else {
      return { succeeded: true };
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): IGuardResult {
    let isValid = false;
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true };
    } else {
      return {
        failed: true,
        message: `${argumentName} is not one of the correct types in ${JSON.stringify(
          validValues
        )}. Got "${value}"`
      };
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return {
        failed: true,
        message: `${argumentName} is not within range ${min} to ${max}`
      };
    } else {
      return { succeeded: true };
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    let failingResult: Boolean = false;
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) failingResult = false;
    }

    if (failingResult) {
      return {
        failed: true,
        message: `${argumentName} is not within the range`
      };
    } else {
      return { succeeded: true };
    }
  }

  public static isDate(date: string, argumentName: string): IGuardResult {
    if (Number.isNaN(Date.parse(date))) {
      return {
        failed: true,
        message: `${argumentName} is not a date`
      };
    } else {
      return { succeeded: true };
    }
  }

  public static isNumber(number: any, argumentName: string): IGuardResult {
    if (number && !Number.isInteger(number)) {
      return {
        failed: true,
        message: `${argumentName} is not a number`
      };
    } else {
      return { succeeded: true };
    }
  }

  public static isUUID(string: string, argumentName: string): IGuardResult {
    if (!validate(string)) {
      return {
        failed: true,
        message: `${argumentName} is not a UUID`
      };
    } else {
      return { succeeded: true };
    }
  }
}
