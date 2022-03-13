import { IGuardResult } from '../../../../framework/Guard';
import Result from '../../../../framework/Result';
import Booking from '../../../../domain/bookings/Booking';
import BookingId from '../../../../domain/bookings/BookingId';

export default interface IBookingOutputPort {
  fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>>;
  deleteBooking(booking: Booking): Promise<number>;
  persistBooking(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
