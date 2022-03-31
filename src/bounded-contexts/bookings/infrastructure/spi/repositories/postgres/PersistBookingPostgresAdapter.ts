import db from './index';
import Booking from '../../../../domain/Booking';
import IPersistBookingInRepository from '../../../../application/ports/outputs/IPersistBookingInRepository';

export default class PersistBookingPostgresAdapter
  implements IPersistBookingInRepository
{
  private static _instance: PersistBookingPostgresAdapter;

  public static instance() {
    if (!PersistBookingPostgresAdapter._instance) {
      this._instance = new PersistBookingPostgresAdapter();
    }
    return this._instance;
  }

  async persist(booking: Booking): Promise<void> {
    const rawBooking = booking.toPersistence();

    await db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => null as unknown as Array<any>);
  }
}
