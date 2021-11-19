import Guard from '../../_shared/Guard';
import UseCaseResult from '../../_shared/UseCaseResult';
import ValueObject from '../../_shared/ValueObject';

interface BookingPeopleNumberProps {
  value: number;
}

export default class BookingPeopleNumber extends ValueObject<BookingPeopleNumberProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: BookingPeopleNumberProps) {
    super(props);
  }

  public static create(
    peopleNumber: number
  ): UseCaseResult<BookingPeopleNumber> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(peopleNumber, 'peopleNumber'),
      Guard.isNumber(peopleNumber, 'peopleNumber')
    ]);

    if (!guardResult.succeeded) {
      return UseCaseResult.fail<BookingPeopleNumber>(guardResult.message);
    } else {
      return UseCaseResult.ok<BookingPeopleNumber>(
        new BookingPeopleNumber({ value: peopleNumber })
      );
    }
  }
}
