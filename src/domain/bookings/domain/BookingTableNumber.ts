import Guard from '../../_shared/Guard';
import UseCaseResult from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

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

  public static create(tableNumber: number): UseCaseResult<BookingTableNumber> {
    const guardResult = Guard.againstNullOrUndefined(
      tableNumber,
      'tableNumber'
    );

    if (!guardResult.succeeded) {
      return UseCaseResult.fail<BookingTableNumber>(guardResult.message);
    } else {
      return UseCaseResult.ok<BookingTableNumber>(
        new BookingTableNumber({ value: tableNumber })
      );
    }
  }
}
