import db from '../index';
import Result from '../../../../../../../framework/result/Result';
import Booking from '../../../../../domain/Booking';
import BookingId from '../../../../../domain/BookingId';
import IFetchBookingByIdFromRepository from '../../../../../application/ports/outputs/IFetchBookingByIdFromRepository';
import { InvalidBookingError } from '../../../../../domain/BookingErrors';

export default class FetchBookingByIdPostgresAdapter
  implements IFetchBookingByIdFromRepository
{
  async booking(
    bookingId: BookingId
  ): Promise<Result<InvalidBookingError, Booking>> {
    const [booking] = await db('bookings').select('*').where({
      id: bookingId.value
    });

    return Booking.init({
      personName: booking?.person_name,
      peopleNumber: booking?.people_number,
      date: booking?.date,
      tableNumber: booking?.table_number,
      openedStatus: booking?.opened_status,
      totalBilled: booking?.total_billed,
      createdAt: booking?.created_at,
      updatedAt: booking?.updated_at
    });
  }
}
