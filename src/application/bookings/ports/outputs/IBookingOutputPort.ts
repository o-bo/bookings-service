import { IGuardResult } from '../../../../framework/guard/Guard';
import Result from '../../../../framework/result/Result';
import Booking from '../../../../domain/bookings/Booking';
import BookingId from '../../../../domain/bookings/BookingId';

export default interface IBookingOutputPort {
  fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>>;
  deleteBooking(booking: Booking): Promise<number>;
  persistBooking(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
