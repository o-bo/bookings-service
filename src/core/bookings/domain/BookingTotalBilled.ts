import Guard from '../../_shared/Guard';
import UseCaseResult from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingTotalBilledProps {
  value: number | null | undefined;
}

export default class BookingTotalBilled extends ValueObject<BookingTotalBilledProps> {
  get value(): number | null | undefined {
    return this.props.value;
  }

  private constructor(props: BookingTotalBilledProps) {
    super(props);
  }

  public static create(
    totalBilled?: number
  ): UseCaseResult<BookingTotalBilled> {
    const guardResult = Guard.isNumber(totalBilled, 'totalBilled');

    if (!guardResult.succeeded) {
      return UseCaseResult.fail<BookingTotalBilled>(guardResult.message);
    } else {
      return UseCaseResult.ok<BookingTotalBilled>(
        new BookingTotalBilled({ value: totalBilled })
      );
    }
  }
}
