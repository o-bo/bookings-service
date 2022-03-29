import { IGuardResult } from "../../../../framework/guard/Guard";
import Result from "../../../../framework/result/Result";
import Booking from "../../../../domain/bookings/Booking";

export default interface IBookingOutputPort {
  persistBooking(booking: Booking): Promise<Result<IGuardResult, Booking>>;
}
