import { InvalidBookingError } from '../../../domain/BookingErrors';
import { UnexpectedError } from '../../../../../framework/error/GenericAppError';

export type CreateBookingError = InvalidBookingError | UnexpectedError;
