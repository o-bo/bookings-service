import RestAdapter from '../../../infrastructure/api/http/express/RestAdapter';
import Booking from '../domain/Booking';
import { InvalidBookingError } from '../domain/BookingErrors';
import BookingMapper from '../mappers/BookingMapper';
import BookingInputPort from '../ports/BookingInputPort';
import CreateBookingDto from '../useCases/createBooking/CreateBookingDto';
import { CreateBookingError } from '../useCases/createBooking/CreateBookingErrors';

export default class CreateBookingRestAdapter extends RestAdapter<
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

      if (result.isFailure) {
        return this.processError(result.errorValue());
      }

      return this.processResult(result.getValue());
    } catch (err: any) {
      return this.fail(err);
    }
  }
}
