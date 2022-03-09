import Guard from '../../_shared/Guard';
import Result from '../../_shared/Result';
import ValueObject from '../../_shared/ValueObject';

const DEFAULT_ERROR_MESSAGE = 'Person name is not valid';

interface BookingPersonNameProps {
  value: string;
}

export default class BookingPersonName extends ValueObject<BookingPersonNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookingPersonNameProps) {
    super(props);
  }

  public static create(personName: string): Result<string, BookingPersonName> {
    const guardResult = Guard.againstNullOrUndefined(personName, 'personName');

    if (guardResult.failed) {
      return Result.fail(guardResult.message || DEFAULT_ERROR_MESSAGE);
    } else {
      return Result.ok(new BookingPersonName({ value: personName }));
    }
  }
}
