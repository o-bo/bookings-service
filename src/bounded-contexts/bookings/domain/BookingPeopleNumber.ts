import ValueObject from '../../../framework/value-object/ValueObject';
import {
  IsNumberSpecification,
  NotNullOrUndefinedSpecification
} from '../../../framework/guard/specifications';
import Specification, {
  SpecificationResult
} from '../../../framework/guard/specifications/specification';

interface BookingPeopleNumberProps {
  value: number;
}

export default class BookingPeopleNumber extends ValueObject<BookingPeopleNumberProps> {
  public specification: Specification<number>;

  get value(): number {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(personName: number) {
    super({ value: personName });
    const notNull = new NotNullOrUndefinedSpecification('peopleNumber');
    const isNumber = new IsNumberSpecification('peopleNumber');
    this.specification = notNull.and(isNumber);
  }
}
