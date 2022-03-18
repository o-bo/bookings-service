import Result from '../../../../framework/result/Result';
import Booking from '../../../../domain/bookings/Booking';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';

// @injectable()
export default interface ICreateBookingUseCase {
  createBooking(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>>;
}
