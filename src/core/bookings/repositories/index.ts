import IBookingRepository from './IBookingRepository';
import BookingRepository from './BookingRepository';

import db from '../../../infrastructure/spi/storage/postgres';

const bookingRepository: IBookingRepository = new BookingRepository(db);

export default bookingRepository;
