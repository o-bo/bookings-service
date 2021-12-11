import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';

import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';

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
  private useCase: IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>;

  constructor(
    @inject(SERVICE_IDENTIFIER.CREATE_BOOKING_USE_CASE)
    useCase: IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  processErrorImpl() {
    switch (this.useCaseError.constructor) {
      case InvalidBookingError:
        return this.unprocessable(this.useCaseError.errorValue());
      default:
        return this.fail(this.useCaseError.errorValue());
    }
  }

  processResultImpl() {
    return this.created(
      BookingMapper.get().toDTO(this.useCaseResult.getValue())
    );
  }

  async executeImpl(): Promise<any> {
    const dto: CreateBookingDto = this.req.body as CreateBookingDto;

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
