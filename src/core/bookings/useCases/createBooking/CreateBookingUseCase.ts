import { v4 } from 'uuid';

import { GenericAppError } from '../../../GenericAppError';
import IUseCase from '../../../IUseCase';
import { Result, left, right } from '../../../UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import CreateBookingDTO from './CreateBookingDTO';
import { InvalidBookingError } from './CreateBookingErrors';
import { CreateBookingResponse } from './CreateBookingResponse';

export default class CreateBookingUseCase
  implements IUseCase<CreateBookingDTO, Promise<CreateBookingResponse>>
{
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(request: CreateBookingDTO): Promise<CreateBookingResponse> {
    const errors = [];
    const {
      personName,
      peopleNumber,
      date,
      tableNumber,
      openedStatus,
      totalBilled
    } = request;

    if (typeof personName === 'undefined' || !personName) {
      errors.push({ personName: 'REQUIRED' });
    }
    if (typeof peopleNumber === 'undefined' || !peopleNumber) {
      errors.push({ peopleNumber: 'REQUIRED' });
    }
    if (typeof date === 'undefined' || !date) errors.push({ date: 'REQUIRED' });
    if (date && Number.isNaN(Date.parse(date)))
      errors.push({ date: 'BAD_FORMAT' });
    if (typeof tableNumber === 'undefined' || tableNumber === null) {
      errors.push({ tableNumber: 'REQUIRED' });
    }
    if (typeof openedStatus === 'undefined' || openedStatus === null) {
      errors.push({ openedStatus: 'REQUIRED' });
    }
    if (
      typeof totalBilled !== 'undefined' &&
      totalBilled &&
      !Number.isInteger(totalBilled)
    ) {
      errors.push({ totalBilled: 'BAD_FORMAT' });
    }

    if (errors.length > 0) {
      return left(new InvalidBookingError(errors)) as CreateBookingResponse;
    }

    const params = {
      id: v4(),
      ...(personName && { person_name: personName }),
      ...(peopleNumber && { people_number: peopleNumber }),
      ...(date && { date }),
      ...(tableNumber && { table_number: tableNumber }),
      ...(openedStatus && { opened_status: openedStatus }),
      ...(totalBilled && { total_billed: totalBilled })
    };

    try {
      const createdBooking = await this.repository.save(params);

      return right(Result.ok<any>(createdBooking));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as CreateBookingResponse;
    }
  }
}
