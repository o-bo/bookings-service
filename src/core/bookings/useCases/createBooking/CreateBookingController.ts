import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import { keysToCamel } from '../../../../shared/utils';
import IUseCase from '../../../IUseCase';
import { Result } from '../../../UseCaseResult';

import CreateBookingDTO from './CreateBookingDTO';
import { CreateBookingError, InvalidBookingError } from './CreateBookingErrors';
import { CreateBookingResponse } from './CreateBookingResponse';

export default class CreateBookingController extends BaseController<CreateBookingDTO> {
  private useCase: IUseCase<CreateBookingDTO, any>;

  constructor(useCase: IUseCase<CreateBookingDTO, any>) {
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

    const processResult = (useCaseResult: Result<any>) =>
      this.created(keysToCamel(useCaseResult.getValue()));

    try {
      const result: CreateBookingResponse = await this.useCase.execute(dto);

      return result.cata(processError, processResult);
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
