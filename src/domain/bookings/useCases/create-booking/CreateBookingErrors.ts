import { InvalidBookingError } from '../../entities/BookingErrors';
import { UnexpectedError } from '../../../../framework/GenericAppError';

export type CreateBookingError = InvalidBookingError | UnexpectedError;
