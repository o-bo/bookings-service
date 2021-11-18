export default interface CreateBookingDTO {
  id?: string;
  personName: string;
  peopleNumber: number;
  date: string;
  tableNumber: number;
  openedStatus: boolean;
  totalBilled?: number;
  createdAt?: string;
  uodatedAt?: string;
}
