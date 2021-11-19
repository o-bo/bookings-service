import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import UseCaseResult, { left, right } from '../../../_shared/UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import { InvalidBookingError } from '../../domain/BookingErrors';

import BookingMapper from '../../mappers/BookingMapper';

import CreateBookingDto from './CreateBookingDto';
import { CreateBookingResponse } from './CreateBookingResponse';

export default class CreateBookingUseCase
  implements IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>
{
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(
    createBookingDTO: CreateBookingDto
  ): Promise<CreateBookingResponse> {
    const bookingOrError =
      BookingMapper.get().fromDtoToDomain(createBookingDTO);

    if (bookingOrError.isFailure) {
      return left(
        new InvalidBookingError(bookingOrError.errorValue())
      ) as CreateBookingResponse;
    }

    try {
      const createdBooking = await this.repository.save(
        bookingOrError.getValue()
      );

      if (!createdBooking) {
        return left(
          new GenericAppError.UnexpectedError(
            'unable to save and return booking'
          )
        ) as CreateBookingResponse;
      }

      return right(UseCaseResult.ok<any>(createdBooking));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as CreateBookingResponse;
    }
  }
}
