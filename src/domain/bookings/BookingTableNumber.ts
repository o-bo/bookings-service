import Guard from '../../framework/Guard';
import Result from '../../framework/Result';
import ValueObject from '../../framework/ValueObject';

const DEFAULT_ERROR_MESSAGE = 'Table number is not valid';

interface BookingTableNumberProps {
  value: number;
}

export default class BookingTableNumber extends ValueObject<BookingTableNumberProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: BookingTableNumberProps) {
    super(props);
  }

  public static create(
    tableNumber: number
  ): Result<string, BookingTableNumber> {
    const guardResult = Guard.againstNullOrUndefined(
      tableNumber,
      'tableNumber'
    );

    if (guardResult.failed) {
      return Result.fail(guardResult.message || DEFAULT_ERROR_MESSAGE);
    } else {
      return Result.ok(new BookingTableNumber({ value: tableNumber }));
    }
  }
}
