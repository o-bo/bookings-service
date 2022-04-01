import RestExpressAdapter from '../../../../../../../framework/express/RestExpressAdapter';
import Booking from '../../../../../domain/Booking';
import { InvalidBookingError } from '../../../../../domain/BookingErrors';
import CreateBookingInputPort from '../../../../../application/ports/inputs/create-booking/CreateBookingInputPort';
import CreateBookingDto from '../../../../../application/useCases/create-booking/CreateBookingDto';
import { CreateBookingError } from '../../../../../application/useCases/create-booking/CreateBookingErrors';

export default class CreateBookingExpressAdapter extends RestExpressAdapter<
  CreateBookingDto,
  Booking,
  CreateBookingError
> {
  private readonly bookingInputPort: CreateBookingInputPort;

  constructor(bookingInputPort: CreateBookingInputPort) {
    super();
    this.bookingInputPort = bookingInputPort;
  }

  concreteError(createBookingError?: CreateBookingError) {
    if (createBookingError) {
      switch (createBookingError.constructor) {
        case InvalidBookingError: {
          this.unprocessable(createBookingError);
        }
        default: {
          this.fail(createBookingError);
        }
      }
    }
    this.fail(createBookingError);
  }

  concreteResponse(createdBooking?: Booking) {
    return this.created(createdBooking!.toDto());
  }

  concreteExecute(dto: CreateBookingDto): void {
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
