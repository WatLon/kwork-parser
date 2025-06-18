import { IUnitOfWork } from './unit-of-work.interface';

export interface ITransaction {
  execute<T>(work: (unitOfWork: IUnitOfWork) => Promise<T>): Promise<T>;
}
