import RestExpressAdapter from '../RestExpressAdapter';
import Booking from '../../../../../domain/bookings/Booking';
import { InvalidBookingError } from '../../../../../domain/bookings/BookingErrors';
import CreateBookingInputPort from '../../../../../application/bookings/ports/inputs/create-booking/CreateBookingInputPort';
import CreateBookingDto from '../../../../../application/bookings/useCases/create-booking/CreateBookingDto';
import { CreateBookingError } from '../../../../../application/bookings/useCases/create-booking/CreateBookingErrors';

export default class CreateBookingRestAdapter extends RestExpressAdapter<
  CreateBookingDto,
  Booking,
  CreateBookingError
> {
  private readonly bookingInputPort: CreateBookingInputPort;

  constructor(bookingInputPort: CreateBookingInputPort) {
    super();
    this.bookingInputPort = bookingInputPort;
  }

  concreteError(createBookingError: CreateBookingError) {
    switch (createBookingError.constructor) {
      case InvalidBookingError: {
        return this.unprocessable(createBookingError);
      }
      default: {
        return this.fail(createBookingError);
      }
    }
  }

  concreteResponse(createdBooking: Booking) {
    return this.created(createdBooking.toDto());
  }

  async concreteResult(dto: CreateBookingDto): Promise<any> {
    try {
      const result = await this.bookingInputPort.result(dto);
      return result.unwrap(this.response.bind(this), this.error.bind(this));
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
