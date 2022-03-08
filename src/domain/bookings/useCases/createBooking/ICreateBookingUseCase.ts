import Result from '../../../_shared/Result';
import Booking from '../../domain/Booking';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';

// @injectable()
export default interface ICreateBookingUseCase {
  createBooking(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>>;
}
