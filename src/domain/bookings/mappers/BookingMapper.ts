import { IGuardResult } from '../../_shared/Guard';
import Mapper from '../../_shared/Mapper';
import Result from '../../_shared/Result';
import UniqueEntityId from '../../_shared/UniqueEntityId';
import Booking from '../domain/Booking';
import BookingDate from '../domain/BookingDate';
import BookingDto from '../domain/BookingDto';
import BookingPeopleNumber from '../domain/BookingPeopleNumber';
import BookingPersonName from '../domain/BookingPersonName';
import BookingTableNumber from '../domain/BookingTableNumber';
import BookingTotalBilled from '../domain/BookingTotalBilled';

export default class BookingMapper extends Mapper<Booking, BookingDto> {
  public fromDomainToPersistence(booking: Booking): any {
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

  public fromDtoToDomain(
    bookingDTO: BookingDto
  ): Result<IGuardResult, Booking> {
    const personNameOrError: Result<IGuardResult, BookingPersonName> =
      BookingPersonName.create(bookingDTO.personName);
    const peopleNumberOrError: Result<IGuardResult, BookingPeopleNumber> =
      BookingPeopleNumber.create(bookingDTO.peopleNumber);
    const dateOrError: Result<IGuardResult, BookingDate> = BookingDate.create(
      bookingDTO.date
    );
    const tableNumberOrError: Result<IGuardResult, BookingTableNumber> =
      BookingTableNumber.create(bookingDTO.tableNumber);
    const totalBilledOrError: Result<IGuardResult, BookingTotalBilled> =
      BookingTotalBilled.create(bookingDTO.totalBilled);

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

    return Booking.create({
      personName: personNameOrError.getValue(),
      peopleNumber: peopleNumberOrError.getValue(),
      date: dateOrError.getValue(),
      tableNumber: tableNumberOrError.getValue(),
      ...(totalBilledOrError.getValue() && {
        totalBilled: totalBilledOrError.getValue()
      }),
      openedStatus: false
    });
  }

  public fromPersistenceToDomain(raw: any): Booking | null {
    const personNameOrError: Result<IGuardResult, BookingPersonName> =
      BookingPersonName.create(raw.person_name);
    const peopleNumberOrError: Result<IGuardResult, BookingPeopleNumber> =
      BookingPeopleNumber.create(raw.people_number);
    const dateOrError: Result<IGuardResult, BookingDate> = BookingDate.create(
      raw.date
    );
    const tableNumberOrError: Result<IGuardResult, BookingTableNumber> =
      BookingTableNumber.create(raw.table_number);
    const totalBilledOrError: Result<IGuardResult, BookingTotalBilled> =
      BookingTotalBilled.create(raw.total_billed);

    const bookingOrError: Result<IGuardResult, Booking> = Booking.create(
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

  public fromDomainToDto(booking: Booking): BookingDto {
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
