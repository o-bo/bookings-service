import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';
import UseCaseResult from '../../../_shared/UseCaseResult';

import Booking from '../../domain/Booking';
import { InvalidBookingError } from '../../domain/BookingErrors';

import BookingMapper from '../../mappers/BookingMapper';

import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';
import { CreateBookingResponse } from './CreateBookingResponse';

export default class CreateBookingController extends BaseController<CreateBookingDto> {
  private useCase: IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>;

  constructor(
    useCase: IUseCase<CreateBookingDto, Promise<CreateBookingResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const dto: CreateBookingDto = this.req.body as CreateBookingDto;

    const processError = (error: CreateBookingError) => {
      switch (error.constructor) {
        case InvalidBookingError:
          return this.unprocessable(error.errorValue());
        default:
          return this.fail(error.errorValue());
      }
    };

    const processResult = (useCaseResult: UseCaseResult<Booking>) =>
      this.created(BookingMapper.get().toDTO(useCaseResult.getValue()));

    try {
      const result = await this.useCase.execute(dto);

      return result.cata(processError, processResult);
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
