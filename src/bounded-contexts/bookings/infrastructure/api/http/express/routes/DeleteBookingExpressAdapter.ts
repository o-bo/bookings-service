import RestExpressAdapter from '../../../../../../../framework/express/RestExpressAdapter';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../../domain/BookingErrors';
import BookingId from '../../../../../domain/BookingId';
import DeleteBookingInputPort from '../../../../../application/ports/inputs/delete-booking/DeleteBookingInputPort';
import DeleteBookingDto from '../../../../../application/useCases/delete-booking/DeleteBookingDto';
import { DeleteBookingError } from '../../../../../application/useCases/delete-booking/DeleteBookingErrors';

export default class DeleteBookingExpressAdapter extends RestExpressAdapter<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  private readonly bookingInputPort: DeleteBookingInputPort;

  constructor(bookingInputPort: DeleteBookingInputPort) {
    super();
    this.bookingInputPort = bookingInputPort;
  }

  protected concreteError(error: DeleteBookingError) {
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

  protected concreteResponse(deletedBookingId: BookingId) {
    return this.ok({
      id: deletedBookingId.value
    } as DeleteBookingDto);
  }

  async concreteResult(dto: DeleteBookingDto): Promise<any> {
    try {
      const result = await this.bookingInputPort.result(dto);
      return result.unwrap(this.response.bind(this), this.error.bind(this));
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
