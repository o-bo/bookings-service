import { validate as validateUUID } from 'uuid';
import { AbstractSpecification, SpecificationResult } from './specification';

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
