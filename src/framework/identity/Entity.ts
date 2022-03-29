import UniqueEntityId from './UniqueEntityId';
import Timestamp from '../timestamps/timestamp';

export default abstract class Entity<PROPS> {
  protected readonly _id: UniqueEntityId;

  protected readonly _createdAt: Timestamp;

  protected readonly _updatedAt: Timestamp;

  public readonly props: PROPS;

  constructor(
    props: PROPS,
    id?: UniqueEntityId,
    createdAt?: Timestamp,
    updatedAt?: Timestamp
  ) {
    this._id = id ? id : new UniqueEntityId();
    this._createdAt = createdAt ? createdAt : new Timestamp();
    this._updatedAt = updatedAt ? updatedAt : new Timestamp();
    this.props = props;
  }

  public abstract toDto(): any;
  public abstract toPersistence(): any;

  public static isEntity(v: any): v is Entity<any> {
    return v instanceof Entity;
  }

  public equals(object?: Entity<PROPS>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
