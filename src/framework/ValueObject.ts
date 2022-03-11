import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [index: string]: any | null | undefined;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */

export default abstract class ValueObject<VOP extends ValueObjectProps> {
  public readonly props: VOP;

  protected constructor(props: VOP) {
    this.props = Object.freeze(props);
  }

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
