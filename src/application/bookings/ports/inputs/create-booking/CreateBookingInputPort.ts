import ICreateBookingUseCase from "../../../useCases/create-booking/ICreateBookingUseCase";
import CreateBookingDto from "../../../useCases/create-booking/CreateBookingDto";
import Result from "../../../../../framework/result/Result";
import { CreateBookingError } from "../../../useCases/create-booking/CreateBookingErrors";
import Booking from "../../../../../domain/bookings/Booking";
import { InvalidBookingError } from "../../../../../domain/bookings/BookingErrors";
import { UnexpectedError } from "../../../../../framework/error/GenericAppError";
import DomainEventsManager from "../../../../../framework/domain-event/DomainEventsManager";
import IPersistBookingOutputPort from "../../outputs/IPersistBookingOutputPort";

export default class CreateBookingInputPort implements ICreateBookingUseCase {
  protected readonly persistBookingOutputPort: IPersistBookingOutputPort;

  constructor(persistBookingOutputPort: IPersistBookingOutputPort) {
    this.persistBookingOutputPort = persistBookingOutputPort;
  }

  async handle(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>> {
    const bookingOrError = Booking.init(createBookingDTO);

    if (bookingOrError.isFailure) {
      return Result.fail(new InvalidBookingError(bookingOrError.unwrap()));
    }

    try {
      const createdBooking = await this.persistBookingOutputPort.persistBooking(
        bookingOrError.unwrap()
      );

      if (createdBooking.isFailure) {
        return Result.fail(
          new UnexpectedError('unable to save and return booking')
        );
      }

      DomainEventsManager.dispatchEventsForAggregate<Booking>(
        createdBooking.unwrap()
      );

      return Result.ok(createdBooking.unwrap());
    } catch (err: any) {
      return Result.fail(new UnexpectedError(err));
    }
  }
}
