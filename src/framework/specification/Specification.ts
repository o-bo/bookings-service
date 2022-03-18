/* eslint-disable @typescript-eslint/no-use-before-define */
export interface Specification<T> {
  isSatisfiedBy(t: T): boolean;
  and(specification: Specification<T>): Specification<T>;
  or(specification: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export default abstract class AbstractSpecification<T>
  implements Specification<T>
{
  abstract isSatisfiedBy(t: T): boolean;

  and(specification: Specification<T>): Specification<T> {
    return new AndSpecification<T>(this, specification);
  }

  or(specification: Specification<T>): Specification<T> {
    return new OrSpecification<T>(this, specification);
  }

  not(): Specification<T> {
    return new NotSpecification<T>(this);
  }
}

export class AndSpecification<T> extends AbstractSpecification<T> {
  #spec1: Specification<T>;

  #spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super();
    this.#spec1 = spec1;
    this.#spec2 = spec2;
  }

  isSatisfiedBy(t: T): boolean {
    return this.#spec1.isSatisfiedBy(t) && this.#spec2.isSatisfiedBy(t);
  }
}

export class OrSpecification<T> extends AbstractSpecification<T> {
  #spec1: Specification<T>;

  #spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super();
    this.#spec1 = spec1;
    this.#spec2 = spec2;
  }

  isSatisfiedBy(t: T): boolean {
    return this.#spec1.isSatisfiedBy(t) || this.#spec2.isSatisfiedBy(t);
  }
}

export class NotSpecification<T> extends AbstractSpecification<T> {
  #spec: Specification<T>;

  constructor(spec: Specification<T>) {
    super();
    this.#spec = spec;
  }

  isSatisfiedBy(t: T): boolean {
    return !this.#spec.isSatisfiedBy(t);
  }
}
