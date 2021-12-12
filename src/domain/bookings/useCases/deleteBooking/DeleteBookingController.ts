import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';

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

@injectable()
export default class DeleteBookingController extends BaseController<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  @inject(SERVICE_IDENTIFIER.DELETE_BOOKING_USE_CASE)
  private readonly useCase!: IUseCase<
    DeleteBookingDto,
    Promise<DeleteBookingResponse>
  >;

  protected processErrorImpl(error: DeleteBookingError) {
    switch (error.constructor) {
      case BookingNotFoundError:
        return this.notFound(error.errorValue());
      case InvalidBookingIdError:
        return this.unprocessable(error.errorValue());
      default:
        return this.fail(error.errorValue());
    }
  }

  protected processResultImpl(useCaseResult: UseCaseResult<BookingId>) {
    return this.ok({
      id: useCaseResult.getValue().value
    } as DeleteBookingDto);
  }

  async executeImpl(dto: DeleteBookingDto): Promise<any> {
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
