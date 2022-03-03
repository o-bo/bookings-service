import { inject, injectable } from 'inversify';
import BaseController from '../../../../infrastructure/api/http/express/BaseController';
import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';
import IUseCase from '../../../_shared/IUseCase';
import Result from '../../../_shared/Result';
import Booking from '../../domain/Booking';
import { InvalidBookingError } from '../../domain/BookingErrors';
import BookingMapper from '../../mappers/BookingMapper';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';

@injectable()
export default class CreateBookingController extends BaseController<
  CreateBookingDto,
  Booking,
  CreateBookingError
> {
  @inject(SERVICE_IDENTIFIER.CREATE_BOOKING_USE_CASE)
  private readonly useCase!: IUseCase<
    CreateBookingDto,
    Promise<Result<CreateBookingError, Booking>>
  >;

  processErrorImpl(createBookingError: CreateBookingError) {
    switch (createBookingError.constructor) {
      case InvalidBookingError: {
        return this.unprocessable(createBookingError);
      }
      default: {
        return this.fail(createBookingError);
      }
    }
  }

  processResultImpl(createdBooking: Booking) {
    return this.created(BookingMapper.get().fromDomainToDto(createdBooking));
  }

  async executeImpl(dto: CreateBookingDto): Promise<any> {
    try {
      const result = await this.useCase.execute(dto);

      if (result.isFailure) {
        return this.processError(result.errorValue());
      }

      return this.processResult(result.getValue());
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
