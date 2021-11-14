import { v4 } from 'uuid';

import IUseCase from '../../../IUseCase';

import IBookingRepository from '../../repositories/IBookingRepository';

import CreateBookingDTO from './CreateBookingDTO';

export default class CreateBookingUseCase implements IUseCase<any, Promise<any>> {
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(request: CreateBookingDTO): Promise<any> {
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
      return {
        type: 'error',
        reason: 'VALIDATION_ERROR',
        errors
      };
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

    return this.repository.save(params);
  }
}
