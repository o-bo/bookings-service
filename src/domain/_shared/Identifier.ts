export default class Identifier<ID> {
  constructor(private value: ID) {
    this.value = value;
  }

  equals(id?: Identifier<ID>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString() {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */

  toValue(): ID {
    return this.value;
  }
}
