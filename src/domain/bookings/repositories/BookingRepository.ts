import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../_ioc/identifiers';
import { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';
import BookingMapper from '../mappers/BookingMapper';
import IBookingRepository from './IBookingRepository';

@injectable()
export default class BookingRepository implements IBookingRepository {
  @inject(SERVICE_IDENTIFIER.KNEX_DB) private readonly db!: any;

  async save(booking: Booking): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const rawBooking = mapper.fromDomainToPersistence(booking);

    const [savedBooking] = (await this.db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => {
        console.log(e);
        return null;
      })) as unknown as Array<any>;

    return Booking.init(mapper.fromPersistenceToDto(savedBooking));
  }

  async deleteBooking(booking: Booking): Promise<number> {
    return this.db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }

  async findById(bookingId: BookingId): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const [booking] = await this.db('bookings').select('*').where({
      id: bookingId.value
    });

    return Booking.init(mapper.fromPersistenceToDto(booking || {}));
  }
}
