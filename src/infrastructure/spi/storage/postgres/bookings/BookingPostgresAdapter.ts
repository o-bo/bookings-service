import db from '../index';
import { IGuardResult } from '../../../../../framework/Guard';
import Result from '../../../../../framework/Result';
import Booking from '../../../../../domain/bookings/Booking';
import BookingId from '../../../../../domain/bookings/BookingId';
import BookingMapper from '../../../../../application/bookings/mappers/BookingMapper';
import IBookingOutputPort from '../../../../../application/bookings/ports/outputs/IBookingOutputPort';

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
