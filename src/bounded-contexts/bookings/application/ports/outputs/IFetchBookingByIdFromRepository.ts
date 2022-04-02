import Booking from '../../../domain/Booking';
import BookingId from '../../../domain/BookingId';

export default interface IFetchBookingByIdFromRepository {
  booking(bookingId: BookingId): Promise<Booking | false>;
}
