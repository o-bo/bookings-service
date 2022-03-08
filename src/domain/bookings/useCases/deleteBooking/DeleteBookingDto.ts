import BookingDto from '../../entities/BookingDto';

export default interface DeleteBookingDto extends BookingDto {
  id: string;
}
