import db from './index';
import Booking from '../../../../domain/Booking';
import IPersistBookingInRepository from '../../../../application/ports/outputs/IPersistBookingInRepository';

export default class PersistBookingPostgresAdapter
  implements IPersistBookingInRepository
{
  async persist(booking: Booking): Promise<void> {
    const rawBooking = booking.toPersistence();

    await db('bookings')
      .insert(rawBooking, ['*'])
      .catch(() => null as unknown as Array<any>);
  }
}
