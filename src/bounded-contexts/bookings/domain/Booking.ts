import AggregateRoot from '../../../framework/aggregate/AggregateRoot';
import { IGuardResult } from '../../../framework/guard/Guard';
import Result from '../../../framework/result/Result';
import UniqueEntityId from '../../../framework/identity/UniqueEntityId';
import BookingDate from './BookingDate';
import BookingDto from './BookingDto';
import BookingEntityId from './BookingEntityId';
import BookingPeopleNumber from './BookingPeopleNumber';
import BookingPersonName from './BookingPersonName';
import BookingTableNumber from './BookingTableNumber';
import BookingTotalBilled from './BookingTotalBilled';
import BookingCreatedEvent from './events/BookingCreatedEvent';
import BookingId from './BookingId';
import Timestamp from '../../../framework/timestamps/timestamp';

interface BookingProps {
  personName: BookingPersonName;
  peopleNumber: BookingPeopleNumber;
  date: BookingDate;
  tableNumber: BookingTableNumber;
  openedStatus: boolean;
  totalBilled?: BookingTotalBilled;
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

  private constructor(
    props: BookingProps,
    id?: UniqueEntityId,
    createdAt?: Timestamp,
    updatedAt?: Timestamp
  ) {
    super(props, id, createdAt, updatedAt);

    // If the id wasn't provided, it means that we're creating a new
    // user, so we should create a UserCreatedEvent.
    const idWasProvided = !!id;

    if (!idWasProvided) {
      this.addDomainEvent(new BookingCreatedEvent(this));
    }
  }

  public static init(
    props: BookingDto,
    id?: string,
    createdAt?: Timestamp,
    updatedAt?: Timestamp
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

    const bookingIdOrError: Result<string, BookingId> = BookingId.create(id);

    const booking = new Booking(
      {
        personName: personNameOrError.unwrap(),
        peopleNumber: peopleNumberOrError.unwrap(),
        date: dateOrError.unwrap(),
        tableNumber: tableNumberOrError.unwrap(),
        ...(totalBilledOrError.unwrap() && {
          totalBilled: totalBilledOrError.unwrap()
        }),
        openedStatus: false
      },
      bookingIdOrError.unwrap(
        (bId: BookingId) => new BookingEntityId(bId.value),
        () => undefined
      ),
      createdAt,
      updatedAt
    );

    return Result.ok(booking);
  }

  toDto(): BookingDto {
    return {
      id: this.id.toValue(),
      personName: this.personName.value,
      peopleNumber: this.peopleNumber.value,
      date: this.date.value,
      tableNumber: this.tableNumber.value,
      openedStatus: this.openedStatus,
      totalBilled: this.totalBilled?.value,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString()
    } as BookingDto;
  }

  toPersistence(): any {
    return {
      id: this.id.toString(),
      person_name: this.personName.value,
      people_number: this.peopleNumber.value,
      date: this.date.value,
      table_number: this.tableNumber.value,
      opened_status: this.openedStatus,
      total_billed: this.totalBilled?.value,
      created_at: this.createdAt.toString(),
      updated_at: this.updatedAt.toString()
    };
  }
}
