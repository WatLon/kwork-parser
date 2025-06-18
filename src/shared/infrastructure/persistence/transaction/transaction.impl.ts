import { ITransaction } from 'src/shared/domain/interfaces/transaction.interface';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from './unit-of-work.impl';
import { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';

export class TransactionImpl implements ITransaction {
  constructor(private readonly dataSource: DataSource) {}
  async execute<T>(work: (unitOfWork: IUnitOfWork) => Promise<T>): Promise<T> {
    return this.dataSource.manager.transaction(async (manager) => {
      const unitOfWork = new TypeOrmUnitOfWork(manager);

      return await work(unitOfWork);
    });
  }
}
