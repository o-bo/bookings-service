import Booking from '../domain/Booking';
import BookingId from '../domain/BookingId';

export default interface IBookingRepository {
  // filterBookingsByDate(date: BookingDate): Promise<Array<Booking>>;
  // findBookingById (id: BookingId): Promise<Booking>;
  deleteBookingById(id: BookingId): Promise<BookingId | null>;
  // exists (email: UserEmail): Promise<boolean>;
  save(booking: Booking): Promise<Booking | null>;
}
