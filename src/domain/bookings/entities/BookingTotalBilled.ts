import Guard from '../../_shared/Guard';
import Result from '../../_shared/Result';
import ValueObject from '../../_shared/ValueObject';

const DEFAULT_ERROR_MESSAGE = 'Total billed is not valid';

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
  ): Result<string, BookingTotalBilled> {
    const guardResult = Guard.isNumber(totalBilled, 'totalBilled');

    if (guardResult.failed) {
      return Result.fail(guardResult.message || DEFAULT_ERROR_MESSAGE);
    } else {
      return Result.ok(new BookingTotalBilled({ value: totalBilled }));
    }
  }
}
