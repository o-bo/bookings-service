import Guard from '../../_shared/Guard';
import UseCaseResult from '../../_shared/UseCaseResult';
import AggregateRoot from '../../_shared/AggregateRoot';
import UniqueEntityId from '../../_shared/UniqueEntityId';

import BookingId from './BookingEntityId';
import BookingPersonName from './BookingPersonName';
import BookingPeopleNumber from './BookingPeopleNumber';
import BookingDate from './BookingDate';
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

  public static create(
    props: BookingProps,
    id?: UniqueEntityId
  ): UseCaseResult<Booking> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.personName, argumentName: 'personName' },
      { argument: props.peopleNumber, argumentName: 'peopleNumber' },
      { argument: props.date, argumentName: 'date' },
      { argument: props.tableNumber, argumentName: 'tableNumber' }
    ]);

    if (!guardResult.succeeded) {
      return UseCaseResult.fail<Booking>(guardResult.message);
    } else {
      const booking = new Booking(props, id);

      // const idWasProvided = !!id;

      // if (!idWasProvided) {
      //   booking.addDomainEvent(new BookingCreatedEvent(booking));
      // }

      return UseCaseResult.ok<Booking>(booking);
    }
  }
}
