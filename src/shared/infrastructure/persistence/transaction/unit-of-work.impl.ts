import { IOrderRepository } from 'src/order/application/repositories/order.repository';
import { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';
import { EntityManager } from 'typeorm';
import { TypeOrmOrderRepository } from '../../../../order/infrastructure/persistence/repositories/typeorm-order.repository';

export class TypeOrmUnitOfWork implements IUnitOfWork {
  public readonly orderRepository: IOrderRepository;

  constructor(manager: EntityManager) {
    this.orderRepository = new TypeOrmOrderRepository(manager);
  }
}
