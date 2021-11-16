import Guard from '../../_shared/Guard';
import Result from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingOpenedStatusProps {
  value: boolean;
}

export default class BookingOpenedStatus extends ValueObject<BookingOpenedStatusProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: BookingOpenedStatusProps) {
    super(props);
  }

  public static create(openedStatus: boolean): Result<BookingOpenedStatus> {
    const guardResult = Guard.againstNullOrUndefined(
      openedStatus,
      'openedStatus'
    );

    if (!guardResult.succeeded) {
      return Result.fail<BookingOpenedStatus>(guardResult.message);
    } else {
      return Result.ok<BookingOpenedStatus>(
        new BookingOpenedStatus({ value: openedStatus })
      );
    }
  }
}
