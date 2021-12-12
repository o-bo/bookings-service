import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';

import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';
import UseCaseResult from '../../../_shared/UseCaseResult';

import Booking from '../../domain/Booking';
import { InvalidBookingError } from '../../domain/BookingErrors';

import BookingMapper from '../../mappers/BookingMapper';

import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';
import { CreateBookingResponse } from './CreateBookingResponse';

@injectable()
export default class CreateBookingController extends BaseController<
  CreateBookingDto,
  Booking,
  CreateBookingError
> {
  @inject(SERVICE_IDENTIFIER.CREATE_BOOKING_USE_CASE)
  private readonly useCase!: IUseCase<
    CreateBookingDto,
    Promise<CreateBookingResponse>
  >;

  processErrorImpl(error: CreateBookingError) {
    switch (error.constructor) {
      case InvalidBookingError:
        return this.unprocessable(error.errorValue());
      default:
        return this.fail(error.errorValue());
    }
  }

  processResultImpl(useCaseResult: UseCaseResult<Booking>) {
    return this.created(BookingMapper.get().toDTO(useCaseResult.getValue()));
  }

  async executeImpl(dto: CreateBookingDto): Promise<any> {
    try {
      const result = await this.useCase.execute(dto);

      return result.cata(
        this.processError.bind(this),
        this.processResult.bind(this)
      );
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
