import { InvalidBookingError } from '../../entities/BookingErrors';
import { UnexpectedError } from '../../../_shared/GenericAppError';

export type CreateBookingError = InvalidBookingError | UnexpectedError;
