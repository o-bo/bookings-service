import { UnexpectedError } from '../../../../../framework/GenericAppError';
import Result from '../../../../../framework/Result';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../entities/BookingErrors';
import BookingId from '../../../entities/BookingId';
import DeleteBookingDto from '../../../useCases/delete-booking/DeleteBookingDto';
import { DeleteBookingError } from '../../../useCases/delete-booking/DeleteBookingErrors';
import IDeleteBookingUseCase from '../../../useCases/delete-booking/IDeleteBookingUseCase';
import IBookingOutputPort from '../../outputs/IBookingOutputPort';

export default class DeleteBookingInputPort implements IDeleteBookingUseCase {
  protected readonly bookingOutputPort: IBookingOutputPort;

  constructor(bookingOutputPort: IBookingOutputPort) {
    this.bookingOutputPort = bookingOutputPort;
  }

  async deleteBooking(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(new InvalidBookingIdError(bookingIdOrError.unwrap()));
    }

    try {
      const bookingOrError = await this.bookingOutputPort.fetchBookingById(
        bookingIdOrError.unwrap()
      );

      if (bookingOrError.isFailure) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to find booking with id ${bookingIdOrError.unwrap().value}`
          )
        );
      }

      await this.bookingOutputPort.deleteBooking(bookingOrError.unwrap());

      return Result.ok(bookingIdOrError.unwrap());
    } catch (err: any) {
      console.log('debug', err);
      return Result.fail(new UnexpectedError(err));
    }
  }
}
