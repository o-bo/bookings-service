import AggregateRoot from '../../../framework/aggregate/AggregateRoot';
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
import Guard from '../../../framework/guard/Guard';

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

  constructor(
    props: BookingDto,
    id?: string,
    createdAt?: Timestamp,
    updatedAt?: Timestamp
  ) {
    const personName: BookingPersonName = new BookingPersonName(
      props.personName
    );
    const peopleNumber: BookingPeopleNumber = new BookingPeopleNumber(
      props.peopleNumber
    );
    const date: BookingDate = new BookingDate(props.date);
    const tableNumber: BookingTableNumber = new BookingTableNumber(
      props.tableNumber
    );
    const totalBilled: BookingTotalBilled = new BookingTotalBilled(
      props.totalBilled || 0
    );

    const bookingId: BookingId = new BookingId(id);

    super(
      {
        personName,
        peopleNumber,
        date,
        tableNumber,
        totalBilled,
        openedStatus: false
      },
      bookingId.validation.succeeded
        ? new BookingEntityId(bookingId!.value)
        : undefined,
      createdAt,
      updatedAt
    );

    this.guard = new Guard([
      personName.validation,
      peopleNumber.validation,
      date.validation,
      tableNumber.validation,
      totalBilled.validation
    ]);

    // If the id wasn't provided, it means that we're creating a new
    // user, so we should create a UserCreatedEvent.
    const idWasProvided = !!id;

    if (!idWasProvided) {
      this.addDomainEvent(new BookingCreatedEvent(this));
    }
  }

  get validated(): boolean {
    return this.guard?.success ?? true;
  }

  get errors(): string[] {
    return this.guard?.errors ?? [];
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
