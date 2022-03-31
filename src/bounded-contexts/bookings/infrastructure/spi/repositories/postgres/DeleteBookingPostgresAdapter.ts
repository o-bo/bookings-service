import db from './index';
import Booking from '../../../../domain/Booking';
import IDeleteBookingFromRepository from '../../../../application/ports/outputs/IDeleteBookingFromRepository';

export default class DeleteBookingPostgresAdapter
  implements IDeleteBookingFromRepository
{
  private static _instance: DeleteBookingPostgresAdapter;

  public static instance() {
    if (!DeleteBookingPostgresAdapter._instance) {
      this._instance = new DeleteBookingPostgresAdapter();
    }
    return this._instance;
  }

  async delete(booking: Booking): Promise<void> {
    await db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }
}
