import { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';

export default interface IBookingRepository {
  // filterBookingsByDate(date: BookingDate): Promise<Array<Booking>>;
  findById(bookingId: BookingId): Promise<Result<IGuardResult, Booking>>;
  deleteBooking(booking: Booking): Promise<number>;
  // exists (email: UserEmail): Promise<boolean>;
  save(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
