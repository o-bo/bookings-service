import { Either, Result } from '../../../UseCaseResult';

import { CreateBookingError } from './CreateBookingErrors';

export type CreateBookingResponse = Either<CreateBookingError, Result<any>>;
