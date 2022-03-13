import Mapper from '../../../framework/Mapper';
import Booking from '../../../domain/bookings/Booking';
import BookingDto from '../../../domain/bookings/BookingDto';

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

  public fromPersistenceToDto(raw: any): BookingDto {
    return {
      personName: raw.person_name,
      peopleNumber: raw.people_number,
      date: raw.date,
      tableNumber: raw.table_number,
      openedStatus: raw.opened_status,
      totalBilled: raw.total_billed,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at
    };
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
