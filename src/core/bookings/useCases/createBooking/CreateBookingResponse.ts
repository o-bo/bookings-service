import Result, { Either } from '../../../_shared/UseCaseResult';

import { CreateBookingError } from './CreateBookingErrors';

export type CreateBookingResponse = Either<CreateBookingError, Result<any>>;
