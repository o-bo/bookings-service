import { GenericAppError } from '../../_shared/GenericAppError';
import Result from '../../_shared/Result';
import Booking from '../domain/Booking';
import {
  BookingNotFoundError,
  InvalidBookingError,
  InvalidBookingIdError
} from '../domain/BookingErrors';
import BookingId from '../domain/BookingId';
import CreateBookingDto from '../useCases/createBooking/CreateBookingDto';
import ICreateBookingUseCase from '../useCases/createBooking/ICreateBookingUseCase';
import DeleteBookingDto from '../useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingError } from '../useCases/deleteBooking/DeleteBookingErrors';
import IDeleteBookingUseCase from '../useCases/deleteBooking/IDeleteBookingUseCase';
import IBookingOutputPort from './IBookingOutputPort';

export default class BookingInputPort
  implements ICreateBookingUseCase, IDeleteBookingUseCase
{
  private readonly bookingOutputPort: IBookingOutputPort;

  constructor(bookingOutputPort: IBookingOutputPort) {
    this.bookingOutputPort = bookingOutputPort;
  }

  async createBooking(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<InvalidBookingError, Booking>> {
    const bookingOrError = Booking.init(createBookingDTO);

    if (bookingOrError.isFailure) {
      return Result.fail(new InvalidBookingError(bookingOrError.errorValue()));
    }

    try {
      const createdBooking = await this.bookingOutputPort.persistBooking(
        bookingOrError.getValue()
      );

      if (createdBooking.isFailure) {
        return Result.fail(
          new GenericAppError.UnexpectedError(
            'unable to save and return booking'
          )
        );
      }

      return Result.ok(createdBooking.getValue());
    } catch (err: any) {
      return Result.fail(new GenericAppError.UnexpectedError(err));
    }
  }

  async deleteBooking(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(
        new InvalidBookingIdError(bookingIdOrError.errorValue())
      );
    }

    try {
      const bookingOrError = await this.bookingOutputPort.fetchBookingById(
        bookingIdOrError.getValue()
      );

      if (bookingOrError.isFailure) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to find booking with id ${
              bookingIdOrError.getValue().value
            }`
          )
        );
      }

      await this.bookingOutputPort.deleteBooking(bookingOrError.getValue());

      return Result.ok(bookingIdOrError.getValue());
    } catch (err: any) {
      console.log('debug', err);
      return Result.fail(new GenericAppError.UnexpectedError(err));
    }
  }
}
