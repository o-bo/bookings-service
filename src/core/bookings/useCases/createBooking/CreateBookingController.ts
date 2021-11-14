import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import { keysToCamel } from '../../../../shared/utils';
import IUseCase from '../../../IUseCase';

import CreateBookingDTO from './CreateBookingDTO';
import { InvalidBookingError } from './CreateBookingErrors';

export default class CreateBookingController extends BaseController {
  private useCase: IUseCase<CreateBookingDTO, any>;

  constructor(useCase: IUseCase<CreateBookingDTO, any>) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const dto: CreateBookingDTO = this.req.body as CreateBookingDTO;

    try {
      // we cannot type the result like this :
      // const result: CreateBookingResponse = await this.useCase.execute(dto);
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case InvalidBookingError:
            return this.unprocessable(error.errorValue());
          default:
            return this.fail(error.errorValue());
        }
      }

      // If we type the result, it will be of type 'never' here and compilation will fail
      return this.created(keysToCamel(result.value.getValue()));
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
