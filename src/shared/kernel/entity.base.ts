import { UniqueEntityID } from './unique-entity-id';

const isEntity = (v?: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  protected props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === undefined || object === null) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
