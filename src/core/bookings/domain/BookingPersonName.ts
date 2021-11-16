import Guard from '../../_shared/Guard';
import Result from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

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

  public static create(personName: string): Result<BookingPersonName> {
    const guardResult = Guard.againstNullOrUndefined(personName, 'personName');

    if (!guardResult.succeeded) {
      return Result.fail<BookingPersonName>(guardResult.message);
    } else {
      return Result.ok<BookingPersonName>(
        new BookingPersonName({ value: personName })
      );
    }
  }
}
