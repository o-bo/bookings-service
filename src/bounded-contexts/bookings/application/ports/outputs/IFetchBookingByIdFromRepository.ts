import { IGuardResult } from '../../../../../framework/guard/Guard';
import Result from '../../../../../framework/result/Result';
import Booking from '../../../domain/Booking';
import BookingId from '../../../domain/BookingId';

export default interface IFetchBookingByIdFromRepository {
  booking(bookingId: BookingId): Promise<Result<IGuardResult, Booking>>;
}
