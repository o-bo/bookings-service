import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';

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

@injectable()
export default class DeleteBookingController extends BaseController<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  private useCase: IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>;

  constructor(
    @inject(SERVICE_IDENTIFIER.DELETE_BOOKING_USE_CASE)
    useCase: IUseCase<DeleteBookingDto, Promise<DeleteBookingResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

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
