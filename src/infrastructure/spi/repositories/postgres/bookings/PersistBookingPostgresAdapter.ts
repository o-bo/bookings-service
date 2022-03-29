import db from '../index';
import Booking from '../../../../../domain/bookings/Booking';
import IPersistBookingOutputPort from '../../../../../application/bookings/ports/outputs/IPersistBookingOutputPort';

export default class PersistBookingPostgresAdapter
  implements IPersistBookingOutputPort
{
  private static _instance: PersistBookingPostgresAdapter;

  public static instance() {
    if (!PersistBookingPostgresAdapter._instance) {
      this._instance = new PersistBookingPostgresAdapter();
    }
    return this._instance;
  }

  async persistBooking(booking: Booking): Promise<void> {
    const rawBooking = booking.toPersistence();

    await db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => null as unknown as Array<any>);
  }
}
