import Guard from '../../_shared/Guard';
import Result from '../../_shared/Result';
import ValueObject from '../../_shared/ValueObject';

const DEFAULT_ERROR_MESSAGE = 'Booking date is not valid';

interface BookingDateProps {
  value: string;
}

export default class BookingDate extends ValueObject<BookingDateProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookingDateProps) {
    super(props);
  }

  public static create(date: string): Result<string, BookingDate> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(date, 'date'),
      Guard.isDate(date, 'date')
    ]);

    if (!guardResult.succeeded) {
      return Result.fail(guardResult.message || DEFAULT_ERROR_MESSAGE);
    } else {
      return Result.ok(new BookingDate({ value: date }));
    }
  }
}
