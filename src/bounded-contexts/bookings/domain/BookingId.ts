import ValueObject from '../../../framework/value-object/ValueObject';
import {
  IsUUIDSpecification,
  NotNullOrUndefinedSpecification
} from '../../../framework/guard/specifications';
import Specification, {
  SpecificationResult
} from '../../../framework/guard/specifications/specification';

interface BookingIdProps {
  value?: string;
}

export default class BookingId extends ValueObject<BookingIdProps> {
  public specification: Specification<string>;

  get value(): string | undefined {
    return this.props.value;
  }

  get validation(): SpecificationResult {
    return this.specification.isSatisfiedBy(this.value);
  }

  constructor(bookingId?: string) {
    super({ value: bookingId });
    const notNull = new NotNullOrUndefinedSpecification('id');
    const isUUID = new IsUUIDSpecification('id');
    this.specification = notNull.and(isUUID);
  }
}
