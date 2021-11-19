import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import UseCaseResult, { left, right } from '../../../_shared/UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import BookingId from '../../domain/BookingId';
import {
  InvalidBookingIdError,
  BookingNotFoundError
} from '../../domain/BookingErrors';

import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingResponse } from './DeleteBookingResponse';

export default class DeleteBookingUseCase
  implements IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>
{
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<DeleteBookingResponse> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return left(
        new InvalidBookingIdError(bookingIdOrError.errorValue())
      ) as DeleteBookingResponse;
    }

    try {
      const deletedBookingId = await this.repository.deleteBookingById(
        bookingIdOrError.getValue()
      );

      if (!deletedBookingId) {
        return left(
          new BookingNotFoundError(
            `unable to delete booking ${bookingIdOrError.getValue().value}`
          )
        ) as DeleteBookingResponse;
      }

      return right(UseCaseResult.ok<any>(deletedBookingId));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as DeleteBookingResponse;
    }
  }
}
