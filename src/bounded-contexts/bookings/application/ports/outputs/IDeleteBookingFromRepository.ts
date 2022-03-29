import Booking from '../../../domain/Booking';

export default interface IDeleteBookingFromRepository {
  delete(booking: Booking): Promise<void>;
}
