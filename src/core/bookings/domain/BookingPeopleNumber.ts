import Guard from '../../_shared/Guard';
import Result from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingPeopleNumberProps {
  value: string;
}

export default class BookingPeopleNumber extends ValueObject<BookingPeopleNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookingPeopleNumberProps) {
    super(props);
  }

  public static create(peopleNumber: string): Result<BookingPeopleNumber> {
    const guardResult = Guard.againstNullOrUndefined(
      peopleNumber,
      'peopleNumber'
    );

    if (!guardResult.succeeded) {
      return Result.fail<BookingPeopleNumber>(guardResult.message);
    } else {
      return Result.ok<BookingPeopleNumber>(
        new BookingPeopleNumber({ value: peopleNumber })
      );
    }
  }
}
