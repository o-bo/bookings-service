import ValueObject from '../../../framework/value-object/ValueObject';
import { NotNullOrUndefinedSpecification } from '../../../framework/guard/specifications';
import Specification, {
  SpecificationResult
} from '../../../framework/guard/specifications/specification';

interface BookingPersonNameProps {
  value: string;
}

export default class BookingPersonName extends ValueObject<BookingPersonNameProps> {
  public specification: Specification<string>;

  get value(): string {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(personName: string) {
    super({ value: personName });
    const notNull = new NotNullOrUndefinedSpecification('personName');
    this.specification = notNull;
  }
}
