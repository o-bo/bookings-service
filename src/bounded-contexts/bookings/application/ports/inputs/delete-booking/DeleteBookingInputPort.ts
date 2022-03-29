import { UnexpectedError } from '../../../../../../framework/error/GenericAppError';
import Result from '../../../../../../framework/result/Result';
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
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(new InvalidBookingIdError(bookingIdOrError.unwrap()));
    }

    try {
      const bookingOrError = await this.fetchBookingByIdOutputPort.booking(
        bookingIdOrError.unwrap()
      );

      if (bookingOrError.isFailure) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to find booking with id ${bookingIdOrError.unwrap().value}`
          )
        );
      }

      await this.deleteBookingOutputPort.delete(bookingOrError.unwrap());

      return Result.ok(bookingIdOrError.unwrap());
    } catch (err: any) {
      console.log('debug', err);
      return Result.fail(new UnexpectedError(err));
    }
  }
}
