import { InvalidBookingError } from '../../../../domain/bookings/BookingErrors';
import { UnexpectedError } from '../../../../framework/error/GenericAppError';

export type CreateBookingError = InvalidBookingError | UnexpectedError;
