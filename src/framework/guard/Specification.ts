/* eslint-disable @typescript-eslint/no-use-before-define */

import { validate as validateUUID } from 'uuid';

export interface SpecificationResult {
  succeeded?: boolean;
  failed?: boolean;
  errors: string[];
}

export interface Specification<T> {
  isSatisfiedBy(t?: T): SpecificationResult;
  and(specification: Specification<T>): Specification<T>;
  or(specification: Specification<T>): Specification<T>;
}

export default abstract class AbstractSpecification<T>
  implements Specification<T>
{
  protected constructor(protected readonly message: string) {}
  abstract isSatisfiedBy(t?: T): SpecificationResult;

  and(specification: Specification<T>): Specification<T> {
    return new AndSpecification<T>(this, specification);
  }

  or(specification: Specification<T>): Specification<T> {
    return new OrSpecification<T>(this, specification);
  }
}

export class AndSpecification<T> extends AbstractSpecification<T> {
  #spec1: Specification<T>;

  #spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super('');
    this.#spec1 = spec1;
    this.#spec2 = spec2;
  }

  isSatisfiedBy(t?: T): SpecificationResult {
    const spec1Result = this.#spec1.isSatisfiedBy(t);
    const spec2Result = this.#spec2.isSatisfiedBy(t);
    return {
      succeeded: spec1Result.succeeded && spec2Result.succeeded,
      failed: spec1Result.failed || spec2Result.failed,
      errors: [...spec1Result.errors, ...spec2Result.errors]
    };
  }
}

export class OrSpecification<T> extends AbstractSpecification<T> {
  #spec1: Specification<T>;

  #spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super('');
    this.#spec1 = spec1;
    this.#spec2 = spec2;
  }

  isSatisfiedBy(t?: T): SpecificationResult {
    const spec1Result = this.#spec1.isSatisfiedBy(t);
    const spec2Result = this.#spec2.isSatisfiedBy(t);
    return {
      succeeded: spec1Result.succeeded || spec2Result.succeeded,
      failed: spec1Result.failed && spec2Result.failed,
      errors: [...spec1Result.errors, ...spec2Result.errors]
    };
  }
}

export class TrueSpecification<T> extends AbstractSpecification<T> {
  constructor() {
    super('');
  }

  isSatisfiedBy(): SpecificationResult {
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class NotNullOrUndefinedSpecification<
  T
> extends AbstractSpecification<T> {
  constructor(argumentName: string) {
    super(`${argumentName} is required`);
  }

  isSatisfiedBy(argument?: T): SpecificationResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: true,
        failed: true,
        errors: [this.message]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class OneOfSpecification<T> extends AbstractSpecification<T> {
  constructor(private readonly validValues: any[], argumentName: string) {
    super(
      `${argumentName} is not one of the correct types in ${JSON.stringify(
        validValues
      )}.`
    );
  }

  isSatisfiedBy(argument?: T): SpecificationResult {
    if (this.validValues.indexOf(argument) === -1) {
      return {
        succeeded: false,
        failed: true,
        errors: [`${this.message} Got "${argument}"`]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class InRangeSpecification extends AbstractSpecification<number> {
  constructor(
    private readonly min: number,
    private readonly max: number,
    argumentName: string
  ) {
    super(`${argumentName} is not within range ${min} to ${max}.`);
  }

  isSatisfiedBy(argument?: number): SpecificationResult {
    if (!argument || argument < this.min || argument > this.max) {
      return {
        succeeded: false,
        failed: true,
        errors: [`${this.message} Got "${argument}"`]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class IsDateSpecification extends AbstractSpecification<string> {
  constructor(argumentName: string) {
    super(`${argumentName} is not a date`);
  }

  isSatisfiedBy(argument?: string): SpecificationResult {
    if (!argument || Number.isNaN(Date.parse(argument))) {
      return {
        succeeded: false,
        failed: true,
        errors: [this.message]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class IsNumberSpecification extends AbstractSpecification<string> {
  constructor(argumentName: string) {
    super(`${argumentName} is not a number`);
  }

  isSatisfiedBy(argument?: string): SpecificationResult {
    if (
      argument === null ||
      argument === undefined ||
      !Number.isInteger(argument)
    ) {
      return {
        succeeded: false,
        failed: true,
        errors: [this.message]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}

export class IsUUIDSpecification extends AbstractSpecification<string> {
  constructor(argumentName: string) {
    super(`${argumentName} is not a UUID`);
  }

  isSatisfiedBy(argument?: string): SpecificationResult {
    if (!argument || !validateUUID(argument)) {
      return {
        succeeded: false,
        failed: true,
        errors: [this.message]
      };
    }
    return { succeeded: true, failed: false, errors: [] };
  }
}
