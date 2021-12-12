import Guard from '../../_shared/Guard';
import UseCaseResult from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingIdProps {
  value: string;
}

export default class BookingId extends ValueObject<BookingIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookingIdProps) {
    super(props);
  }

  public static create(id: string): UseCaseResult<BookingId> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(id, 'id'),
      Guard.isUUID(id, 'id')
    ]);

    if (!guardResult.succeeded) {
      return UseCaseResult.fail<BookingId>(guardResult.message);
    } else {
      return UseCaseResult.ok<BookingId>(new BookingId({ value: id }));
    }
  }
}
