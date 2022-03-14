import AggregateRoot from '../../framework/AggregateRoot';
import { IGuardResult } from '../../framework/Guard';
import Result from '../../framework/Result';
import UniqueEntityId from '../../framework/UniqueEntityId';
import BookingDate from './BookingDate';
import BookingDto from './BookingDto';
import BookingEntityId from './BookingEntityId';
import BookingPeopleNumber from './BookingPeopleNumber';
import BookingPersonName from './BookingPersonName';
import BookingTableNumber from './BookingTableNumber';
import BookingTotalBilled from './BookingTotalBilled';
import BookingCreatedEvent from './events/BookingCreatedEvent';

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
  get bookingEntityId(): BookingEntityId {
    return this.id;
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
    const personNameOrError: Result<string, BookingPersonName> =
      BookingPersonName.create(props.personName);
    const peopleNumberOrError: Result<string, BookingPeopleNumber> =
      BookingPeopleNumber.create(props.peopleNumber);
    const dateOrError: Result<string, BookingDate> = BookingDate.create(
      props.date
    );
    const tableNumberOrError: Result<string, BookingTableNumber> =
      BookingTableNumber.create(props.tableNumber);
    const totalBilledOrError: Result<string, BookingTotalBilled> =
      BookingTotalBilled.create(props.totalBilled);

    const guardResult = Result.combine([
      personNameOrError,
      peopleNumberOrError,
      dateOrError,
      tableNumberOrError,
      totalBilledOrError
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.unwrap());
    }

    const booking = new Booking(
      {
        personName: personNameOrError.unwrap(),
        peopleNumber: peopleNumberOrError.unwrap(),
        date: dateOrError.unwrap(),
        tableNumber: tableNumberOrError.unwrap(),
        ...(totalBilledOrError.unwrap() && {
          totalBilled: totalBilledOrError.unwrap()
        }),
        openedStatus: false,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt
      },
      id
    );

    // If the id wasn't provided, it means that we're creating a new
    // user, so we should create a UserCreatedEvent.
    const idWasProvided = !!id;

    if (!idWasProvided) {
      // Method from the AggregateRoot parent class. We'll look
      // closer at this.
      booking.addDomainEvent(new BookingCreatedEvent(booking));
    }

    return Result.ok(booking);
  }
}
