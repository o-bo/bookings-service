export default interface BookingDto {
  personName: string;
  peopleNumber: number;
  date: string;
  tableNumber: number;
  openedStatus: boolean;
  totalBilled?: number;
  createdAt?: string;
  updatedAt?: string;
}
