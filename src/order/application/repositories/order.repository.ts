import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { Order } from '../../domain/entities/order.entity';

export interface IOrderRepository {
  findByExternalId(id: string): Promise<Order | null>;
  findById(id: UniqueEntityID): Promise<Order | null>;
  save(order: Order): Promise<void>;
}
