import Guard from '../../_shared/Guard';
import Result from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

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

  public static create(date: string): Result<BookingDate> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(date, 'date'),
      Guard.isDate(date, 'date')
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<BookingDate>(guardResult.message);
    } else {
      return Result.ok<BookingDate>(new BookingDate({ value: date }));
    }
  }
}
