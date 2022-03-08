import RestAdapter from '../../../infrastructure/api/http/express/RestAdapter';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../domain/BookingErrors';
import BookingId from '../domain/BookingId';
import BookingInputPort from '../ports/BookingInputPort';
import DeleteBookingDto from '../useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingError } from '../useCases/deleteBooking/DeleteBookingErrors';

export default class DeleteBookingRestAdapter extends RestAdapter<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  private readonly bookingInputPort: BookingInputPort;

  constructor(bookingInputPort: BookingInputPort) {
    super();
    this.bookingInputPort = bookingInputPort;
  }

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
      const result = await this.bookingInputPort.deleteBooking(dto);

      if (result.isFailure) {
        return this.processError(result.errorValue());
      }

      return this.processResult(result.getValue());
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
