import db from "../index";
import { IGuardResult } from "../../../../../framework/guard/Guard";
import Result from "../../../../../framework/result/Result";
import Booking from "../../../../../domain/bookings/Booking";
import BookingMapper from "../../../../../application/bookings/mappers/BookingMapper";
import IPersistBookingOutputPort from "../../../../../application/bookings/ports/outputs/IPersistBookingOutputPort";

export default class PersistBookingPostgresAdapter implements IPersistBookingOutputPort {
  private static instance: PersistBookingPostgresAdapter;

  public static getInstance() {
    if (!PersistBookingPostgresAdapter.instance) {
      this.instance = new PersistBookingPostgresAdapter();
    }
    return this.instance;
  }

  async persistBooking(
    booking: Booking
  ): Promise<Result<IGuardResult, Booking>> {
    const mapper = BookingMapper.get();
    const rawBooking = mapper.fromDomainToPersistence(booking);

    const [savedBooking] = (await db('bookings')
      .insert(rawBooking, ['*'])
      .catch((e: any) => {
        console.log(e);
        return null;
      })) as unknown as Array<any>;

    return Booking.init(
      mapper.fromPersistenceToDto(savedBooking),
      savedBooking.id
    );
  }
}
