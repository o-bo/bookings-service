import db from '../index';
import Booking from '../../../../../domain/Booking';
import IDeleteBookingFromRepository from '../../../../../application/ports/outputs/IDeleteBookingFromRepository';

export default class DeleteBookingPostgresAdapter
  implements IDeleteBookingFromRepository
{
  async delete(booking: Booking): Promise<void> {
    await db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }
}
