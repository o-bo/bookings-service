import Guard, { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
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

  public static create(
    tableNumber: number
  ): Result<IGuardResult, BookingTableNumber> {
    const guardResult = Guard.againstNullOrUndefined(
      tableNumber,
      'tableNumber'
    );

    if (guardResult.failed) {
      return Result.fail(guardResult.message);
    } else {
      return Result.ok(new BookingTableNumber({ value: tableNumber }));
    }
  }
}
