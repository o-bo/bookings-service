import Booking from '../../../domain/Booking';

export default interface IPersistBookingInRepository {
  persist(booking: Booking): Promise<void>;
}
