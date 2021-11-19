import IUseCase from '../../../_shared/IUseCase';

import bookingRepository from '../../repositories';

import DeleteBookingUseCase from './DeleteBookingUseCase';
import DeleteBookingDto from './DeleteBookingDto';

const deleteBookingUseCase: IUseCase<DeleteBookingDto, any> =
  new DeleteBookingUseCase(bookingRepository);

export default deleteBookingUseCase;
