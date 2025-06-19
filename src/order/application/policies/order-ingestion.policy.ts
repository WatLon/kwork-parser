import { Order } from 'src/order/domain/entities/order.entity';

export interface IOrderIngestionPolicy {
  isSatisfiedBy(order: Order): boolean;
}
