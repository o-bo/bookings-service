import Guard from '../../_shared/Guard';
import Result from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingTotalBilledProps {
  value: number;
}

export default class BookingTotalBilled extends ValueObject<BookingTotalBilledProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: BookingTotalBilledProps) {
    super(props);
  }

  public static create(totalBilled: number): Result<BookingTotalBilled> {
    const guardResult = Guard.isNumber(totalBilled, 'totalBilled');

    if (!guardResult.succeeded) {
      return Result.fail<BookingTotalBilled>(guardResult.message);
    } else {
      return Result.ok<BookingTotalBilled>(
        new BookingTotalBilled({ value: totalBilled })
      );
    }
  }
}
