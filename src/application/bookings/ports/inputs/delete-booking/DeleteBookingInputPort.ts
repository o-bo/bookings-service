import { UnexpectedError } from "../../../../../framework/error/GenericAppError";
import Result from "../../../../../framework/result/Result";
import { BookingNotFoundError, InvalidBookingIdError } from "../../../../../domain/bookings/BookingErrors";
import BookingId from "../../../../../domain/bookings/BookingId";
import DeleteBookingDto from "../../../useCases/delete-booking/DeleteBookingDto";
import { DeleteBookingError } from "../../../useCases/delete-booking/DeleteBookingErrors";
import IDeleteBookingUseCase from "../../../useCases/delete-booking/IDeleteBookingUseCase";
import IDeleteBookingOutputPort from "../../outputs/IDeleteBookingOutputPort";
import IFetchBookingByIdOutputPort from "../../outputs/IFetchBookingByIdOutputPort";

export default class DeleteBookingInputPort implements IDeleteBookingUseCase {
  protected readonly deleteBookingOutputPort: IDeleteBookingOutputPort;
  protected readonly fetchBookingByIdOutputPort: IFetchBookingByIdOutputPort;

  constructor(deleteBookingOutputPort: IDeleteBookingOutputPort, fetchBookingByIdOutputPort: IFetchBookingByIdOutputPort) {
    this.deleteBookingOutputPort = deleteBookingOutputPort;
    this.fetchBookingByIdOutputPort = fetchBookingByIdOutputPort;
  }

  async result(
    deleteBookingDTO: DeleteBookingDto
  ): Promise<Result<DeleteBookingError, BookingId>> {
    const bookingIdOrError = BookingId.create(deleteBookingDTO.id);

    if (bookingIdOrError.isFailure) {
      return Result.fail(new InvalidBookingIdError(bookingIdOrError.unwrap()));
    }

    try {
      const bookingOrError = await this.fetchBookingByIdOutputPort.fetchBookingById(
        bookingIdOrError.unwrap()
      );

      if (bookingOrError.isFailure) {
        return Result.fail(
          new BookingNotFoundError(
            `unable to find booking with id ${bookingIdOrError.unwrap().value}`
          )
        );
      }

      await this.deleteBookingOutputPort.deleteBooking(bookingOrError.unwrap());

      return Result.ok(bookingIdOrError.unwrap());
    } catch (err: any) {
      console.log('debug', err);
      return Result.fail(new UnexpectedError(err));
    }
  }
}
