import db from '../index';
import Booking from '../../../../../domain/Booking';
import BookingId from '../../../../../domain/BookingId';
import IFetchBookingByIdFromRepository from '../../../../../application/ports/outputs/IFetchBookingByIdFromRepository';

export default class FetchBookingByIdPostgresAdapter
  implements IFetchBookingByIdFromRepository
{
  async booking(bookingId: BookingId): Promise<Booking | false> {
    const [booking] = await db('bookings').select('*').where({
      id: bookingId.value
    });

    return (
      booking &&
      new Booking(
        {
          personName: booking.person_name,
          peopleNumber: booking.people_number,
          date: booking.date,
          tableNumber: booking.table_number,
          openedStatus: booking.opened_status,
          totalBilled: booking.total_billed
        },
        booking.id,
        booking.created_at,
        booking.updated_at
      )
    );
  }
}
