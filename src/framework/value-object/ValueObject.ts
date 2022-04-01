import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [index: string]: any | null | undefined;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */

export default abstract class ValueObject<VOP extends ValueObjectProps> {
  protected constructor(public readonly props: VOP) {}

  public equals(vo?: ValueObject<VOP>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return shallowEqual(this.props, vo.props);
  }
}
