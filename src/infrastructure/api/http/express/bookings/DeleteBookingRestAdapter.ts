import RestExpressAdapter from '../RestExpressAdapter';
import {
  BookingNotFoundError,
  InvalidBookingIdError
} from '../../../../../domain/bookings/BookingErrors';
import BookingId from '../../../../../domain/bookings/BookingId';
import DeleteBookingInputPort from '../../../../../application/bookings/ports/inputs/delete-booking/DeleteBookingInputPort';
import DeleteBookingDto from '../../../../../application/bookings/useCases/delete-booking/DeleteBookingDto';
import { DeleteBookingError } from '../../../../../application/bookings/useCases/delete-booking/DeleteBookingErrors';

export default class DeleteBookingRestAdapter extends RestExpressAdapter<
  DeleteBookingDto,
  BookingId,
  DeleteBookingError
> {
  private readonly bookingInputPort: DeleteBookingInputPort;

  constructor(bookingInputPort: DeleteBookingInputPort) {
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
