import { UnexpectedError } from '../../../../../../framework/error/GenericAppError';
import Result, { Fail, Ok } from '../../../../../../framework/result/Result';
import Booking from '../../../../domain/Booking';
import { InvalidBookingError } from '../../../../domain/BookingErrors';
import CreateBookingDto from '../../../useCases/create-booking/CreateBookingDto';
import { CreateBookingError } from '../../../useCases/create-booking/CreateBookingErrors';
import ICreateBookingUseCase from '../../../useCases/create-booking/ICreateBookingUseCase';
import IPersistBookingInRepository from '../../outputs/IPersistBookingInRepository';

export default class CreateBookingInputPort implements ICreateBookingUseCase {
  protected readonly persistBookingOutputPort: IPersistBookingInRepository;

  constructor(persistBookingOutputPort: IPersistBookingInRepository) {
    this.persistBookingOutputPort = persistBookingOutputPort;
  }

  async result(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>> {
    const booking = new Booking(createBookingDTO);

    if (!booking.validated) {
      return new Fail(new InvalidBookingError(booking.errors));
    }

    try {
      await this.persistBookingOutputPort.persist(booking);

      return new Ok(booking);
    } catch (err: any) {
      return new Fail(new UnexpectedError(err));
    }
  }
}
