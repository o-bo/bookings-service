import Booking from '../../../domain/Booking';
import CreateBookingDto from './CreateBookingDto';
import { CreateBookingError } from './CreateBookingErrors';
import IUseCase from '../../../../../framework/use-case/IUseCase';

// @injectable()
export default interface ICreateBookingUseCase
  extends IUseCase<CreateBookingDto, CreateBookingError, Booking> {}
