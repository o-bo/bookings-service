import db from '../index';
import { IGuardResult } from '../../../../../framework/guard/Guard';
import Result from '../../../../../framework/result/Result';
import Booking from '../../../../../domain/bookings/Booking';
import BookingId from '../../../../../domain/bookings/BookingId';
import IFetchBookingByIdOutputPort from '../../../../../application/bookings/ports/outputs/IFetchBookingByIdOutputPort';

export default class FetchBookingByIdPostgresAdapter
  implements IFetchBookingByIdOutputPort
{
  private static _instance: FetchBookingByIdPostgresAdapter;

  public static instance() {
    if (!FetchBookingByIdPostgresAdapter._instance) {
      this._instance = new FetchBookingByIdPostgresAdapter();
    }
    return this._instance;
  }

  async fetchBookingById(
    bookingId: BookingId
  ): Promise<Result<IGuardResult, Booking>> {
    const [booking] = await db('bookings').select('*').where({
      id: bookingId.value
    });

    return Booking.init({
      personName: booking?.person_name,
      peopleNumber: booking?.people_number,
      date: booking?.date,
      tableNumber: booking?.table_number,
      openedStatus: booking?.opened_status,
      totalBilled: booking?.total_billed,
      createdAt: booking?.created_at,
      updatedAt: booking?.updated_at
    });
  }
}
