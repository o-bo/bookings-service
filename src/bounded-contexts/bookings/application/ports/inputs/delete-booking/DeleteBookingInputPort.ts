import { UnexpectedError } from '../../../../../../framework/error/GenericAppError';
import Result, { Fail, Ok } from '../../../../../../framework/result/Result';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../domain/BookingErrors';
import BookingId from '../../../../domain/BookingId';
import DeleteBookingDto from '../../../useCases/delete-booking/DeleteBookingDto';
import { DeleteBookingError } from '../../../useCases/delete-booking/DeleteBookingErrors';
import IDeleteBookingUseCase from '../../../useCases/delete-booking/IDeleteBookingUseCase';
import IDeleteBookingFromRepository from '../../outputs/IDeleteBookingFromRepository';
import IFetchBookingByIdFromRepository from '../../outputs/IFetchBookingByIdFromRepository';

export default class DeleteBookingInputPort implements IDeleteBookingUseCase {
  protected readonly deleteBookingOutputPort: IDeleteBookingFromRepository;

  protected readonly fetchBookingByIdOutputPort: IFetchBookingByIdFromRepository;

  constructor(
    deleteBookingOutputPort: IDeleteBookingFromRepository,
    fetchBookingByIdOutputPort: IFetchBookingByIdFromRepository
  ) {
    this.deleteBookingOutputPort = deleteBookingOutputPort;
    this.fetchBookingByIdOutputPort = fetchBookingByIdOutputPort;
  }

  async result(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingId = new BookingId(deleteBookingDTO.id);
    const bookingIdValidation = bookingId.validation;

    if (bookingIdValidation.failed) {
      return new Fail(new InvalidBookingIdError(bookingIdValidation.errors[0]));
    }

    try {
      const bookingOrError = await this.fetchBookingByIdOutputPort.booking(
        bookingId
      );

      if (bookingOrError.isFailure) {
        return bookingOrError.map(
          () =>
            new BookingNotFoundError(
              `unable to find booking with id ${bookingId.value}`
            )
        );
      }

      await this.deleteBookingOutputPort.delete(bookingOrError.unwrap());

      return new Ok(bookingId);
    } catch (err: any) {
      return new Fail(new UnexpectedError(err));
    }
  }
}
