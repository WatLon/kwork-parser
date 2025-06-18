import { IOrderRepository } from 'src/order/application/repositories/order.repository';
import { EntityManager, Repository } from 'typeorm';
import { OrderOrmEntity } from '../models/order.orm-entity';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';

export class TypeOrmOrderRepository implements IOrderRepository {
  private readonly repository: Repository<OrderOrmEntity>;
  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(OrderOrmEntity);
  }

  async findById(id: UniqueEntityID): Promise<Order | null> {
    const order = await this.repository.findOneBy({ id: id.toString() });
    return order ? OrderMapper.toDomain(order) : null;
  }

  async findByExternalId(id: string): Promise<Order | null> {
    const order = await this.repository.findOneBy({ externalId: id });
    return order ? OrderMapper.toDomain(order) : null;
  }

  async save(order: Order): Promise<void> {
    const orderToSave = OrderMapper.toPersistence(order);
    await this.repository.save(orderToSave);
  }
}
