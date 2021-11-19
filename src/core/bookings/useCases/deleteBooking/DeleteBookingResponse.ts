import UseCaseResult, { Either } from '../../../_shared/UseCaseResult';

import { DeleteBookingError } from './DeleteBookingErrors';

export type DeleteBookingResponse = Either<
  DeleteBookingError,
  UseCaseResult<any>
>;
