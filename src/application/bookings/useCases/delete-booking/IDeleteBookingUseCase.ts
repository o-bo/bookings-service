import BookingId from '../../../../domain/bookings/BookingId';
import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';
import IUseCase from '../../../../framework/use-case/IUseCase';

export default interface IDeleteBookingUseCase
  extends IUseCase<DeleteBookingDto, DeleteBookingError, BookingId> {}
