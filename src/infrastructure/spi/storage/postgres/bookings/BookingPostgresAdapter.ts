import db from '../index';
import { IGuardResult } from '../../../../../domain/_shared/Guard';
import Result from '../../../../../domain/_shared/Result';
import Booking from '../../../../../domain/bookings/entities/Booking';
import BookingId from '../../../../../domain/bookings/entities/BookingId';
import BookingMapper from '../../../../../domain/bookings/mappers/BookingMapper';
import IBookingOutputPort from '../../../../../domain/bookings/ports/IBookingOutputPort';

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
