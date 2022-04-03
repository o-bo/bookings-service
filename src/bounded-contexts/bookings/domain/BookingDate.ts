import ValueObject from '../../../framework/value-object/ValueObject';
import {
  IsDateSpecification,
  NotNullOrUndefinedSpecification
} from '../../../framework/guard/specifications';
import Specification, {
  SpecificationResult
} from '../../../framework/guard/specifications/specification';

interface BookingDateProps {
  value: string;
}

export default class BookingDate extends ValueObject<BookingDateProps> {
  public specification: Specification<string>;

  get value(): string {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(date: string) {
    super({ value: date });
    const notNull = new NotNullOrUndefinedSpecification('date');
    const isDate = new IsDateSpecification('date');
    this.specification = notNull.and(isDate);
  }
}
