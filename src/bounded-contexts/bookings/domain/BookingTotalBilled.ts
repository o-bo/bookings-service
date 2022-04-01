import ValueObject from '../../../framework/value-object/ValueObject';
import {
  IsNumberSpecification,
  NotNullOrUndefinedSpecification,
  Specification,
  SpecificationResult
} from '../../../framework/guard/Specification';

interface BookingTotalBilledProps {
  value: number;
}

export default class BookingTotalBilled extends ValueObject<BookingTotalBilledProps> {
  public specification: Specification<number>;

  get value(): number {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(totalBilled: number) {
    super({ value: totalBilled });
    const notNull = new NotNullOrUndefinedSpecification('totalBilled');
    const isNumber = new IsNumberSpecification('totalBilled');
    this.specification = notNull.and(isNumber);
  }
}
