import BaseController from '../../../../infrastructure/api/http/express/BaseController';

import IUseCase from '../../../_shared/IUseCase';

import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';
import BookingId from '../../domain/BookingId';

import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';
import { DeleteBookingResponse } from './DeleteBookingResponse';

export default class DeleteBookingController extends BaseController<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  protected processErrorImpl() {
    switch (this.useCaseError.constructor) {
      case BookingNotFoundError:
        return this.notFound(this.useCaseError.errorValue());
      case InvalidBookingIdError:
        return this.unprocessable(this.useCaseError.errorValue());
      default:
        return this.fail(this.useCaseError.errorValue());
    }
  }

  protected processResultImpl() {
    return this.ok({
      id: this.useCaseResult.getValue().value
    } as DeleteBookingDto);
  }

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
