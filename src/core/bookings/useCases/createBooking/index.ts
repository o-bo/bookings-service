import IUseCase from '../../../_shared/IUseCase';

import bookingRepository from '../../repositories';

import CreateBookingUseCase from './CreateBookingUseCase';
import CreateBookingDto from './CreateBookingDto';

const createBookingUseCase: IUseCase<CreateBookingDto, any> =
  new CreateBookingUseCase(bookingRepository);

export default createBookingUseCase;
