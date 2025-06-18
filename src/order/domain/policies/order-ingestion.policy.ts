import { Order } from '../entities/order.entity';

export interface IOrderIngestionPolicy {
  isSatisfiedBy(order: Order): boolean;
}
