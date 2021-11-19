import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';
import UseCaseResult from '../../../_shared/UseCaseResult';

import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';
import BookingId from '../../domain/BookingId';

import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';
import { DeleteBookingResponse } from './DeleteBookingResponse';

export default class DeleteBookingController extends BaseController<DeleteBookingDto> {
  private useCase: IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>;

  constructor(
    useCase: IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const dto: DeleteBookingDto = this.req
      .params as unknown as DeleteBookingDto;

    const processError = (error: DeleteBookingError) => {
      switch (error.constructor) {
        case BookingNotFoundError:
          return this.notFound(error.errorValue());
        case InvalidBookingIdError:
          return this.unprocessable(error.errorValue());
        default:
          return this.fail(error.errorValue());
      }
    };

    const processResult = (useCaseResult: UseCaseResult<BookingId>) =>
      this.ok({ id: useCaseResult.getValue().value } as DeleteBookingDto);

    try {
      const result = await this.useCase.execute(dto);

      return result.cata(processError, processResult);
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
