import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';
import Result from '../../../_shared/UseCaseResult';
import Booking from '../../domain/Booking';
import BookingMapper from '../../mappers/BookingMapper';

import CreateBookingDTO from './CreateBookingDTO';
import { CreateBookingError, InvalidBookingError } from './CreateBookingErrors';
import { CreateBookingResponse } from './CreateBookingResponse';

export default class CreateBookingController extends BaseController<CreateBookingDTO> {
  private useCase: IUseCase<CreateBookingDTO, Promise<CreateBookingResponse>>;

  constructor(
    useCase: IUseCase<CreateBookingDTO, Promise<CreateBookingResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const dto: CreateBookingDTO = this.req.body as CreateBookingDTO;

    const processError = (error: CreateBookingError) => {
      switch (error.constructor) {
        case InvalidBookingError:
          return this.unprocessable(error.errorValue());
        default:
          return this.fail(error.errorValue());
      }
    };

    const processResult = (useCaseResult: Result<Booking>) =>
      this.created(BookingMapper.get().toDTO(useCaseResult.getValue()));

    try {
      const result = await this.useCase.execute(dto);

      return result.cata(processError, processResult);
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
