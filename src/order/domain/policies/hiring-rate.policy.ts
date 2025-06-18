import { Injectable, Logger } from '@nestjs/common';
import { Order } from 'src/order/domain/entities/order.entity';
import { IOrderIngestionPolicy } from 'src/order/domain/policies/order-ingestion.policy';

@Injectable()
export class HiringRatePolicy implements IOrderIngestionPolicy {
  private readonly logger = new Logger(HiringRatePolicy.name);
  isSatisfiedBy(order: Order): boolean {
    const hiringRate = order.clientInfo.hiringRate;
    if (hiringRate.value === 0) {
      this.logger.warn(`Order rejected by policy: Client hiring rate is 0%.`);
      return false;
    }
    return true;
  }
}
