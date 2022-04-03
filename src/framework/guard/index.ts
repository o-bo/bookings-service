import { TrueSpecification } from './specifications';
import { SpecificationResult } from './specifications/specification';

export default class Guard {
  constructor(private readonly specificationResults: SpecificationResult[]) {}

  get result(): SpecificationResult {
    return this.specificationResults.reduce(
      (previousResult, nextResult) => ({
        succeeded: previousResult.succeeded && nextResult.succeeded,
        failed: previousResult.failed || nextResult.failed,
        errors: [...previousResult.errors, ...nextResult.errors]
      }),
      new TrueSpecification().isSatisfiedBy()
    );
  }

  get success(): boolean {
    return this.result.succeeded;
  }

  get errors(): string[] {
    return this.result.errors;
  }
}
