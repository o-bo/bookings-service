import UniqueEntityId from './UniqueEntityId';

export default abstract class Entity<PROPS> {
  protected readonly _id: UniqueEntityId;

  public readonly props: PROPS;

  constructor(props: PROPS, id?: UniqueEntityId) {
    this._id = id ? id : new UniqueEntityId();
    this.props = props;
  }

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
