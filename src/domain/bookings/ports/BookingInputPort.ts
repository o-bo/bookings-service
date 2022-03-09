import { UnexpectedError } from '../../_shared/GenericAppError';
import Result from '../../_shared/Result';
import Booking from '../entities/Booking';
import {
  BookingNotFoundError,
  InvalidBookingError,
  InvalidBookingIdError
} from '../entities/BookingErrors';
import BookingId from '../entities/BookingId';
import CreateBookingDto from '../useCases/createBooking/CreateBookingDto';
import ICreateBookingUseCase from '../useCases/createBooking/ICreateBookingUseCase';
import DeleteBookingDto from '../useCases/deleteBooking/DeleteBookingDto';
import { DeleteBookingError } from '../useCases/deleteBooking/DeleteBookingErrors';
import IDeleteBookingUseCase from '../useCases/deleteBooking/IDeleteBookingUseCase';
import IBookingOutputPort from './IBookingOutputPort';
import { CreateBookingError } from '../useCases/createBooking/CreateBookingErrors';

export default class BookingInputPort
  implements ICreateBookingUseCase, IDeleteBookingUseCase
{
  private readonly bookingOutputPort: IBookingOutputPort;

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

  async deleteBooking(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(new InvalidBookingIdError(bookingIdOrError.unwrap()));
    }

    try {
      const bookingOrError = await this.bookingOutputPort.fetchBookingById(
        bookingIdOrError.unwrap()
      );

      if (bookingOrError.isFailure) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to find booking with id ${bookingIdOrError.unwrap().value}`
          )
        );
      }

      await this.bookingOutputPort.deleteBooking(bookingOrError.unwrap());

      return Result.ok(bookingIdOrError.unwrap());
    } catch (err: any) {
      console.log('debug', err);
      return Result.fail(new UnexpectedError(err));
    }
  }
}
