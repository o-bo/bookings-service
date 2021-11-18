import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import Result, { left, right } from '../../../_shared/UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import BookingMapper from '../../mappers/BookingMapper';

import CreateBookingDTO from './CreateBookingDTO';
import { CreateBookingResponse } from './CreateBookingResponse';
import { InvalidBookingError } from './CreateBookingErrors';

export default class CreateBookingUseCase
  implements IUseCase<CreateBookingDTO, Promise<CreateBookingResponse>>
{
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(bookingDTO: CreateBookingDTO): Promise<CreateBookingResponse> {
    const bookingOrError = BookingMapper.get().fromDTOToDomain(bookingDTO);

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

      return right(Result.ok<any>(createdBooking));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as CreateBookingResponse;
    }
  }
}
