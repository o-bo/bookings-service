import Result from '../../../../../framework/result/Result';
import Booking from '../../../domain/Booking';
import BookingId from '../../../domain/BookingId';
import { InvalidBookingError } from '../../../domain/BookingErrors';

export default interface IFetchBookingByIdFromRepository {
  booking(bookingId: BookingId): Promise<Result<InvalidBookingError, Booking>>;
}
