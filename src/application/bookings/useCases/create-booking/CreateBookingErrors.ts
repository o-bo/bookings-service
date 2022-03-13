import { InvalidBookingError } from '../../../../domain/bookings/BookingErrors';
import { UnexpectedError } from '../../../../framework/GenericAppError';

export type CreateBookingError = InvalidBookingError | UnexpectedError;
