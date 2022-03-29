import Booking from "../../../../domain/bookings/Booking";

export default interface IBookingOutputPort {
  persistBooking(booking: Booking): Promise<void>;
}
