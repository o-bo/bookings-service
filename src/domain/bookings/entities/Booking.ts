import AggregateRoot from '../../_shared/AggregateRoot';
import { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
import UniqueEntityId from '../../_shared/UniqueEntityId';
import BookingDate from './BookingDate';
import BookingDto from './BookingDto';
import BookingId from './BookingEntityId';
import BookingPeopleNumber from './BookingPeopleNumber';
import BookingPersonName from './BookingPersonName';
import BookingTableNumber from './BookingTableNumber';
import BookingTotalBilled from './BookingTotalBilled';

interface BookingProps {
  personName: BookingPersonName;
  peopleNumber: BookingPeopleNumber;
  date: BookingDate;
  tableNumber: BookingTableNumber;
  openedStatus: boolean;
  totalBilled?: BookingTotalBilled;
  createdAt?: string;
  updatedAt?: string;
}

export default class Booking extends AggregateRoot<BookingProps> {
  get id(): UniqueEntityId {
    return this._id;
  }

  get bookingId(): BookingId {
    return BookingId.caller(this.id);
  }

  get personName(): BookingPersonName {
    return this.props.personName;
  }

  get peopleNumber(): BookingPeopleNumber {
    return this.props.peopleNumber;
  }

  get date(): BookingDate {
    return this.props.date;
  }

  get tableNumber(): BookingTableNumber {
    return this.props.tableNumber;
  }

  get openedStatus(): boolean {
    return this.props.openedStatus;
  }

  get totalBilled(): BookingTotalBilled | undefined {
    return this.props.totalBilled;
  }

  get createdAt(): string | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): string | undefined {
    return this.props.updatedAt;
  }

  private constructor(props: BookingProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static init(
    props: BookingDto,
    id?: UniqueEntityId
  ): Result<IGuardResult, Booking> {
    const personNameOrError: Result<IGuardResult, BookingPersonName> =
      BookingPersonName.create(props.personName);
    const peopleNumberOrError: Result<IGuardResult, BookingPeopleNumber> =
      BookingPeopleNumber.create(props.peopleNumber);
    const dateOrError: Result<IGuardResult, BookingDate> = BookingDate.create(
      props.date
    );
    const tableNumberOrError: Result<IGuardResult, BookingTableNumber> =
      BookingTableNumber.create(props.tableNumber);
    const totalBilledOrError: Result<IGuardResult, BookingTotalBilled> =
      BookingTotalBilled.create(props.totalBilled);

    const guardResult = Result.combine([
      personNameOrError,
      peopleNumberOrError,
      dateOrError,
      tableNumberOrError,
      totalBilledOrError
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.errorValue());
    }

    const booking = new Booking(
      {
        personName: personNameOrError.getValue(),
        peopleNumber: peopleNumberOrError.getValue(),
        date: dateOrError.getValue(),
        tableNumber: tableNumberOrError.getValue(),
        ...(totalBilledOrError.getValue() && {
          totalBilled: totalBilledOrError.getValue()
        }),
        openedStatus: false,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt
      },
      id
    );

    // const idWasProvided = !!id;

    // if (!idWasProvided) {
    //   booking.addDomainEvent(new BookingCreatedEvent(booking));
    // }

    return Result.ok(booking);
  }
}
