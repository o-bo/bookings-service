import { IGuardResult } from '../../_shared/Guard';
import Result from '../../_shared/Result';
import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';

export default interface IBookingOutputPort {
  fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>>;
  deleteBooking(booking: Booking): Promise<number>;
  persistBooking(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
