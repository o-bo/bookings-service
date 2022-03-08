import db from '../../../infrastructure/spi/storage/postgres';
import { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';
import BookingMapper from '../mappers/BookingMapper';
import IBookingOutputPort from '../ports/IBookingOutputPort';

export default class BookingPostgresAdapter implements IBookingOutputPort {
  async persistBooking(
    booking: Booking
  ): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const rawBooking = mapper.fromDomainToPersistence(booking);

    const [savedBooking] = (await db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => {
        console.log(e);
        return null;
      })) as unknown as Array<any>;

    return Booking.init(mapper.fromPersistenceToDto(savedBooking));
  }

  async fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const [booking] = await db('bookings').select('*').where({
      id: bookingId.value
    });

    return Booking.init(mapper.fromPersistenceToDto(booking || {}));
  }

  deleteBooking(booking: Booking): Promise<number> {
    return db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }
}
