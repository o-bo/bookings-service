import Booking from "../../../../domain/bookings/Booking";

export default interface IDeleteBookingOutputPort {
  deleteBooking(booking: Booking): Promise<number>;
}
