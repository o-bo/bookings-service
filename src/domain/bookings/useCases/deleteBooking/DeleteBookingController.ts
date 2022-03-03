import { inject, injectable } from 'inversify';
import BaseController from '../../../../infrastructure/api/http/express/BaseController';
import SERVICE_IDENTIFIER from '../../../_ioc/identifiers';
import IUseCase from '../../../_shared/IUseCase';
import Result from '../../../_shared/Result';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../domain/BookingErrors';
import BookingId from '../../domain/BookingId';
import DeleteBookingDto from './DeleteBookingDto';
import { DeleteBookingError } from './DeleteBookingErrors';

@injectable()
export default class DeleteBookingController extends BaseController<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  @inject(SERVICE_IDENTIFIER.DELETE_BOOKING_USE_CASE)
  private readonly useCase!: IUseCase<
    DeleteBookingDto,
    Promise<Result<DeleteBookingError, BookingId>>
  >;

  protected processErrorImpl(error: DeleteBookingError) {
    switch (error.constructor) {
      case BookingNotFoundError: {
        return this.notFound(error);
      }
      case InvalidBookingIdError: {
        return this.unprocessable(error);
      }
      default: {
        return this.fail(error);
      }
    }
  }

  protected processResultImpl(deletedBookingId: BookingId) {
    return this.ok({
      id: deletedBookingId.value
    } as DeleteBookingDto);
  }

  async executeImpl(dto: DeleteBookingDto): Promise<any> {
    try {
      const result = await this.useCase.execute(dto);

      if (result.isFailure) {
        return this.processError(result.errorValue());
      }

      return this.processResult(result.getValue());
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
