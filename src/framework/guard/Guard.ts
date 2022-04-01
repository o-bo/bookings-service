import { SpecificationResult, TrueSpecification } from './Specification';

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
}
