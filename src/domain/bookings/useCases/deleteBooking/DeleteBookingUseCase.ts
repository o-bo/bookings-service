import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';
import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import Result from '../../../_shared/Result';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';
import BookingId from '../../domain/BookingId';
import IBookingRepository from '../../repositories/IBookingRepository';
import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';

@injectable()
export default class DeleteBookingUseCase
  implements
    IUseCase<DeleteBookingDto, Promise<Result<DeleteBookingError, BookingId>>>
{
  @inject(SERVICE_IDENTIFIER.BOOKING_REPOSITORY)
  private readonly repository!: IBookingRepository;

  async execute(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(
        new InvalidBookingIdError(bookingIdOrError.errorValue())
      );
    }

    try {
      const deletedBookingId = await this.repository.deleteBookingById(
        bookingIdOrError.getValue()
      );

      if (!deletedBookingId) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to delete booking ${bookingIdOrError.getValue().value}`
          )
        );
      }

      return Result.ok(deletedBookingId);
    } catch (err: any) {
      return Result.fail(new GenericAppError.UnexpectedError(err));
    }
  }
}
