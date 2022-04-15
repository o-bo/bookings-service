import DomainEventsManager from '../../../../../../../framework/domain-event/DomainEventsManager';
import IPersistBookingInRepository from '../../../../../application/ports/outputs/IPersistBookingInRepository';
import Booking from '../../../../../domain/Booking';
import db from '../index';

export default class PersistBookingPostgresAdapter
  implements IPersistBookingInRepository
{
  async persist(booking: Booking): Promise<void> {
    const rawBooking = booking.toPersistence();

    await db('bookings')
      .insert(rawBooking, ['*'])
      .then(() => {
        DomainEventsManager.dispatchEventsForAggregate<Booking>(booking);
      })
      .catch(() => null as unknown as Array<any>);
  }
}
