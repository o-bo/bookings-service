import ValueObject from '../../../framework/value-object/ValueObject';
import {
  IsNumberSpecification,
  NotNullOrUndefinedSpecification
} from '../../../framework/guard/specifications';
import Specification, {
  SpecificationResult
} from '../../../framework/guard/specifications/specification';

interface BookingTableNumberProps {
  value: number;
}

export default class BookingTableNumber extends ValueObject<BookingTableNumberProps> {
  public specification: Specification<number>;

  get value(): number {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(tableNumber: number) {
    super({ value: tableNumber });
    const notNull = new NotNullOrUndefinedSpecification('tableNumber');
    const isNumber = new IsNumberSpecification('tableNumber');
    this.specification = notNull.and(isNumber);
  }
}
