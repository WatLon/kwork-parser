import { DomainEvent } from 'src/shared/kernel/domain-event';
import { RawClientInfoProps } from '../value-objects/client-info.value-object';
import { MoneyProps } from '../../../shared/domain/value-objects/money.value-object';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';

export interface OrderRejectedEventData {
  title: string;
  description: string;
  budget: MoneyProps;
  responses: number;
  clientInfo: RawClientInfoProps;
}

export class OrderRejectedEvent extends DomainEvent<OrderRejectedEventData> {
  public static readonly eventName = 'order.rejected';

  constructor(aggregateId: UniqueEntityID, eventData: OrderRejectedEventData) {
    super(aggregateId, eventData);
  }
}
