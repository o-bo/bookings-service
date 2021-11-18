export default abstract class Mapper<T> {
  public toDomain(raw: any): T | null {
    throw new Error('must be overriden');
  }

  public toPersistence(t: T): any {
    throw new Error('must be overriden');
  }
  // public static toDTO (t: T): DTO;
}
