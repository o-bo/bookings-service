import { AndSpecification, OrSpecification } from './index';

export interface SpecificationResult {
  succeeded: boolean;
  failed: boolean;
  errors: string[];
}

export default interface Specification<T> {
  isSatisfiedBy(t?: T): SpecificationResult;

  and(specification: Specification<T>): Specification<T>;

  or(specification: Specification<T>): Specification<T>;
}

export abstract class AbstractSpecification<T> implements Specification<T> {
  protected constructor(protected readonly message: string) {}

  abstract isSatisfiedBy(t?: T): SpecificationResult;

  and(specification: Specification<T>): Specification<T> {
    return new AndSpecification<T>(this, specification);
  }

  or(specification: Specification<T>): Specification<T> {
    return new OrSpecification<T>(this, specification);
  }
}
