import RestExpressAdapter from '../RestExpressAdapter';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../../domain/bookings/entities/BookingErrors';
import BookingId from '../../../../../domain/bookings/entities/BookingId';
import BookingInputPort from '../../../../../domain/bookings/ports/BookingInputPort';
import DeleteBookingDto from '../../../../../domain/bookings/useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingError } from '../../../../../domain/bookings/useCases/deleteBooking/DeleteBookingErrors';

export default class DeleteBookingRestAdapter extends RestExpressAdapter<
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
      return result.unwrap(
        this.processResult.bind(this),
        this.processError.bind(this)
      );
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
