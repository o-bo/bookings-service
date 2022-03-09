import Guard from '../../_shared/Guard';
import Result from '../../_shared/Result';
import ValueObject from '../../_shared/ValueObject';

const DEFAULT_ERROR_MESSAGE = 'Bookig Id is not valid';

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

  public static create(id: string): Result<string, BookingId> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(id, 'id'),
      Guard.isUUID(id, 'id')
    ]);

    if (guardResult.failed) {
      return Result.fail(guardResult.message || DEFAULT_ERROR_MESSAGE);
    } else {
      return Result.ok(new BookingId({ value: id }));
    }
  }
}
