import RestExpressAdapter from '../RestExpressAdapter';
import Booking from '../../../../../domain/bookings/entities/Booking';
import { InvalidBookingError } from '../../../../../domain/bookings/entities/BookingErrors';
import BookingMapper from '../../../../../domain/bookings/mappers/BookingMapper';
import BookingInputPort from '../../../../../domain/bookings/ports/BookingInputPort';
import CreateBookingDto from '../../../../../domain/bookings/useCases/createBooking/CreateBookingDto';
import { CreateBookingError } from '../../../../../domain/bookings/useCases/createBooking/CreateBookingErrors';

export default class CreateBookingRestAdapter extends RestExpressAdapter<
  CreateBookingDto,
  Booking,
  CreateBookingError
> {
  private readonly bookingInputPort: BookingInputPort;

  constructor(bookingInputPort: BookingInputPort) {
    super();
    this.bookingInputPort = bookingInputPort;
  }

  processErrorImpl(createBookingError: CreateBookingError) {
    switch (createBookingError.constructor) {
      case InvalidBookingError: {
        return this.unprocessable(createBookingError);
      }
      default: {
        return this.fail(createBookingError);
      }
    }
  }

  processResultImpl(createdBooking: Booking) {
    return this.created(BookingMapper.get().fromDomainToDto(createdBooking));
  }

  async executeImpl(dto: CreateBookingDto): Promise<any> {
    try {
      const result = await this.bookingInputPort.createBooking(dto);
      return result.unwrap(
        this.processResult.bind(this),
        this.processError.bind(this)
      );
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
