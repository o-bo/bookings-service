import { IGuardResult } from '../../../_shared/Guard';
import Result from '../../../_shared/Result';
import Booking from '../../entities/Booking';
import BookingId from '../../entities/BookingId';

export default interface IBookingOutputPort {
  fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>>;
  deleteBooking(booking: Booking): Promise<number>;
  persistBooking(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
