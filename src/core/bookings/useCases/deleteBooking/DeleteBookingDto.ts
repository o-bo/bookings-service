import BookingDto from '../../domain/BookingDto';

export default interface DeleteBookingDto extends BookingDto {
  id: string;
}
