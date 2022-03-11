import Result from '../../../../framework/Result';
import Booking from '../../entities/Booking';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';

// @injectable()
export default interface ICreateBookingUseCase {
  createBooking(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>>;
}
