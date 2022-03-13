import ICreateBookingUseCase from '../../../useCases/create-booking/ICreateBookingUseCase';
import IBookingOutputPort from '../../outputs/IBookingOutputPort';
import CreateBookingDto from '../../../useCases/create-booking/CreateBookingDto';
import Result from '../../../../../framework/Result';
import { CreateBookingError } from '../../../useCases/create-booking/CreateBookingErrors';
import Booking from '../../../../../domain/bookings/Booking';
import { InvalidBookingError } from '../../../../../domain/bookings/BookingErrors';
import { UnexpectedError } from '../../../../../framework/GenericAppError';

export default class CreateBookingInputPort implements ICreateBookingUseCase {
  protected readonly bookingOutputPort: IBookingOutputPort;

  constructor(bookingOutputPort: IBookingOutputPort) {
    this.bookingOutputPort = bookingOutputPort;
  }

  async createBooking(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>> {
    const bookingOrError = Booking.init(createBookingDTO);

    if (bookingOrError.isFailure) {
      return Result.fail(new InvalidBookingError(bookingOrError.unwrap()));
    }

    try {
      const createdBooking = await this.bookingOutputPort.persistBooking(
        bookingOrError.unwrap()
      );

      if (createdBooking.isFailure) {
        return Result.fail(
          new UnexpectedError('unable to save and return booking')
        );
      }

      return Result.ok(createdBooking.unwrap());
    } catch (err: any) {
      return Result.fail(new UnexpectedError(err));
    }
  }
}
