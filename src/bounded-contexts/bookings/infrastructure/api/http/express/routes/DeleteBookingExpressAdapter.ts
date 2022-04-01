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

  protected concreteError(deleteBookingError?: DeleteBookingError) {
    if (deleteBookingError) {
      switch (deleteBookingError.constructor) {
        case BookingNotFoundError: {
          this.notFound(deleteBookingError);
        }
        case InvalidBookingIdError: {
          this.unprocessable(deleteBookingError);
        }
        default: {
          this.fail(deleteBookingError);
        }
      }
    }
    this.fail(deleteBookingError);
  }

  protected concreteResponse(deletedBookingId: BookingId) {
    return this.ok({
      id: deletedBookingId.value
    } as DeleteBookingDto);
  }

  concreteExecute(dto: DeleteBookingDto): void {
    this.bookingInputPort
      .result(dto)
      .then((result) => {
        result.unwrap(this.response.bind(this), this.error.bind(this));
      })
      .catch((err) => {
        this.next(err);
      });
  }
}
