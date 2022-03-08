import Guard, { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
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
  ): Result<IGuardResult, BookingPeopleNumber> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(peopleNumber, 'peopleNumber'),
      Guard.isNumber(peopleNumber, 'peopleNumber')
    ]);

    if (guardResult.failed) {
      return Result.fail(guardResult.message);
    } else {
      return Result.ok(new BookingPeopleNumber({ value: peopleNumber }));
    }
  }
}
