import Result from '../../../_shared/Result';
import BookingId from '../../entities/BookingId';
import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';

export default interface IDeleteBookingUseCase {
  deleteBooking(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>>;
}
