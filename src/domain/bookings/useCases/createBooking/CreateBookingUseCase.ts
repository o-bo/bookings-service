import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';
import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import Result from '../../../_shared/Result';
import Booking from '../../domain/Booking';
import { InvalidBookingError } from '../../domain/BookingErrors';
import BookingMapper from '../../mappers/BookingMapper';
import IBookingRepository from '../../repositories/IBookingRepository';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';

@injectable()
export default class CreateBookingUseCase
  implements
    IUseCase<CreateBookingDto, Promise<Result<CreateBookingError, Booking>>>
{
  @inject(SERVICE_IDENTIFIER.BOOKING_REPOSITORY)
  private readonly repository!: IBookingRepository;

  async execute(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>> {
    const bookingOrError =
      BookingMapper.get().fromDtoToDomain(createBookingDTO);

    if (bookingOrError.isFailure) {
      return Result.fail(new InvalidBookingError(bookingOrError.errorValue()));
    }

    try {
      const createdBooking = await this.repository.save(
        bookingOrError.getValue()
      );

      if (!createdBooking) {
        return Result.fail(
          new GenericAppError.UnexpectedError(
            'unable to save and return booking'
          )
        );
      }

      return Result.ok(createdBooking);
    } catch (err: any) {
      return Result.fail(new GenericAppError.UnexpectedError(err));
    }
  }
}
