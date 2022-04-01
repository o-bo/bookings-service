import ICreateBookingUseCase from '../../../useCases/create-booking/ICreateBookingUseCase';
import CreateBookingDto from '../../../useCases/create-booking/CreateBookingDto';
import Result from '../../../../../../framework/result/Result';
import { CreateBookingError } from '../../../useCases/create-booking/CreateBookingErrors';
import Booking from '../../../../domain/Booking';
import { UnexpectedError } from '../../../../../../framework/error/GenericAppError';
import DomainEventsManager from '../../../../../../framework/domain-event/DomainEventsManager';
import IPersistBookingInRepository from '../../outputs/IPersistBookingInRepository';

export default class CreateBookingInputPort implements ICreateBookingUseCase {
  protected readonly persistBookingOutputPort: IPersistBookingInRepository;

  constructor(persistBookingOutputPort: IPersistBookingInRepository) {
    this.persistBookingOutputPort = persistBookingOutputPort;
  }

  async result(
    createBookingDTO: CreateBookingDto
  ): Promise<Result<CreateBookingError, Booking>> {
    const bookingOrError = Booking.init(createBookingDTO);

    if (bookingOrError.isFailure) {
      return bookingOrError;
    }

    try {
      await this.persistBookingOutputPort.persist(bookingOrError.unwrap());

      DomainEventsManager.dispatchEventsForAggregate<Booking>(
        bookingOrError.unwrap()
      );

      return bookingOrError;
    } catch (err: any) {
      return bookingOrError.map(() => new UnexpectedError(err));
    }
  }
}
