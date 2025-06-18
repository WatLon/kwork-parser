import { IOrderRepository } from '../../../order/application/repositories/order.repository';

export interface IUnitOfWork {
  orderRepository: IOrderRepository;
}
