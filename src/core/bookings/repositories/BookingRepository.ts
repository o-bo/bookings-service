import Booking from '../domain/Booking';
import BookingMapper from '../mappers/BookingMapper';

import IBookingRepository from './IBookingRepository';

export default class BookingRepository implements IBookingRepository {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async save(booking: Booking): Promise<Booking | null> {
    const mapper = BookingMapper.get();
    const rawBooking = mapper.toPersistence(booking);

    const [savedBooking] = (await this.db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => {
        console.log(e);
        return null;
      })) as unknown as Array<any>;
    return mapper.fromPersistenceToDomain(savedBooking);
  }
}
