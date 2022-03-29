export default class Timestamp {
  constructor(private readonly value?: Date) {
    this.value = value ? value : new Date();
  }

  equals(ts?: Timestamp): boolean {
    if (ts === null || ts === undefined) {
      return false;
    }
    if (!(ts instanceof this.constructor)) {
      return false;
    }
    return ts.toValue().toString() === this.value!.toString();
  }

  toString(): string {
    return this.value!.toString();
  }

  toValue(): Date {
    return this.value!;
  }
}
