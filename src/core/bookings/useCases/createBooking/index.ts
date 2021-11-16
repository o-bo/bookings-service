import IUseCase from '../../../_shared/IUseCase';

import bookingRepository from '../../repositories';

import CreateBookingUseCase from './CreateBookingUseCase';
import CreateBookingDTO from './CreateBookingDTO';

const createBookingUseCase: IUseCase<CreateBookingDTO, any> =
  new CreateBookingUseCase(bookingRepository);

export default createBookingUseCase;
