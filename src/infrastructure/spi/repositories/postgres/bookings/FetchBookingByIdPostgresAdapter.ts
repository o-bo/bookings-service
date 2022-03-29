import db from "../index";
import { IGuardResult } from "../../../../../framework/guard/Guard";
import Result from "../../../../../framework/result/Result";
import Booking from "../../../../../domain/bookings/Booking";
import BookingId from "../../../../../domain/bookings/BookingId";
import BookingMapper from "../../../../../application/bookings/mappers/BookingMapper";
import IFetchBookingByIdOutputPort from "../../../../../application/bookings/ports/outputs/IFetchBookingByIdOutputPort";

export default class FetchBookingByIdPostgresAdapter implements IFetchBookingByIdOutputPort {
  private static instance: FetchBookingByIdPostgresAdapter;

  public static getInstance() {
    if (!FetchBookingByIdPostgresAdapter.instance) {
      this.instance = new FetchBookingByIdPostgresAdapter();
    }
    return this.instance;
  }

  async fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const [booking] = await db('bookings').select('*').where({
      id: bookingId.value
    });

    return Booking.init(mapper.fromPersistenceToDto(booking || {}));
  }
}
