import { v4 as uuid } from 'uuid';

export class UniqueEntityID {
  private value: string;

  constructor(id?: string) {
    this.value = id ? id : uuid();
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return this.value === id.toValue();
  }

  toValue(): string {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }
}
