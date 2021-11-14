import IBookingRepository from './IBookingRepository';

export default class BookingRepository implements IBookingRepository {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async save(booking: any): Promise<any> {
    const [savedBooking] = (await this.db('bookings').insert(booking, [
      '*'
    ])) as unknown as Array<any>;
    return savedBooking;
  }
}
