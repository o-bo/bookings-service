import { v4 } from 'uuid';

import Identifier from './Identifier';

export default class UniqueEntityId extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : v4());
  }
}
