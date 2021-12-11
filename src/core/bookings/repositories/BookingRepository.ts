import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../../_ioc/identifiers';

import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';
import BookingMapper from '../mappers/BookingMapper';

import IBookingRepository from './IBookingRepository';
@injectable()
export default class BookingRepository implements IBookingRepository {
  private db: any;

  constructor(@inject(SERVICE_IDENTIFIER.KNEX_DB) db: any) {
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

  async deleteBookingById(id: BookingId): Promise<BookingId | null> {
    const nbDeletedBooking: number = await this.db('bookings')
      .where({
        id: id.value
      })
      .delete();

    if (nbDeletedBooking === 0) {
      return null;
    }
    return id;
  }
}
