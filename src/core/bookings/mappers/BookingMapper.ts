import Mapper from '../../_shared/Mapper';
import UniqueEntityId from '../../_shared/UniqueEntityId';
import UseCaseResult from '../../_shared/UseCaseResult';

import BookingDto from '../domain/BookingDto';
import Booking from '../domain/Booking';
import BookingDate from '../domain/BookingDate';
import BookingPeopleNumber from '../domain/BookingPeopleNumber';
import BookingPersonName from '../domain/BookingPersonName';
import BookingTableNumber from '../domain/BookingTableNumber';
import BookingTotalBilled from '../domain/BookingTotalBilled';

export default class BookingMapper extends Mapper<Booking, BookingDto> {
  public toPersistence(booking: Booking): any {
    return {
      id: booking.id.toString(),
      person_name: booking.personName.value,
      people_number: booking.peopleNumber.value,
      date: booking.date.value,
      table_number: booking.tableNumber.value,
      opened_status: booking.openedStatus,
      total_billed: booking.totalBilled?.value
    };
  }

  public fromDtoToDomain(bookingDTO: BookingDto): UseCaseResult<Booking> {
    const personNameOrError = BookingPersonName.create(bookingDTO.personName);
    const peopleNumberOrError = BookingPeopleNumber.create(
      bookingDTO.peopleNumber
    );
    const dateOrError = BookingDate.create(bookingDTO.date);
    const tableNumberOrError = BookingTableNumber.create(
      bookingDTO.tableNumber
    );
    const totalBilledOrError = BookingTotalBilled.create(
      bookingDTO.totalBilled
    );

    const combinedPropsResult = UseCaseResult.combine([
      personNameOrError,
      peopleNumberOrError,
      dateOrError,
      tableNumberOrError,
      totalBilledOrError
    ]);

    if (combinedPropsResult.isFailure) {
      return combinedPropsResult;
    }

    const bookingOrError = Booking.create({
      personName: personNameOrError.getValue(),
      peopleNumber: peopleNumberOrError.getValue(),
      date: dateOrError.getValue(),
      tableNumber: tableNumberOrError.getValue(),
      ...(totalBilledOrError.getValue() && {
        totalBilled: totalBilledOrError.getValue()
      }),
      openedStatus: false
    });

    return bookingOrError;
  }

  public fromPersistenceToDomain(raw: any): Booking | null {
    const personNameOrError: UseCaseResult<BookingPersonName> =
      BookingPersonName.create(raw.person_name);
    const peopleNumberOrError: UseCaseResult<BookingPeopleNumber> =
      BookingPeopleNumber.create(raw.people_number);
    const dateOrError: UseCaseResult<BookingDate> = BookingDate.create(
      raw.date
    );
    const tableNumberOrError: UseCaseResult<BookingTableNumber> =
      BookingTableNumber.create(raw.table_number);
    const totalBilledOrError: UseCaseResult<BookingTotalBilled> =
      BookingTotalBilled.create(raw.total_billed);

    const bookingOrError: UseCaseResult<Booking> = Booking.create(
      {
        personName: personNameOrError.getValue(),
        peopleNumber: peopleNumberOrError.getValue(),
        date: dateOrError.getValue(),
        tableNumber: tableNumberOrError.getValue(),
        openedStatus: raw.opened_status,
        totalBilled: totalBilledOrError.getValue(),
        createdAt: raw.created_at,
        updatedAt: raw.updated_at
      },
      new UniqueEntityId(raw.id)
    );

    return bookingOrError.isSuccess ? bookingOrError.getValue() : null;
  }

  public toDTO(booking: Booking): BookingDto {
    return {
      id: booking.id.toValue(),
      personName: booking.personName.value,
      peopleNumber: booking.peopleNumber.value,
      date: booking.date.value,
      tableNumber: booking.tableNumber.value,
      openedStatus: booking.openedStatus,
      totalBilled: booking.totalBilled?.value,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    } as BookingDto;
  }

  private static instance?: BookingMapper;

  public static get() {
    if (!BookingMapper.instance) {
      BookingMapper.instance = new BookingMapper();
    }
    return BookingMapper.instance;
  }
}
