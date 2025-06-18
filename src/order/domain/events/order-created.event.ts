import { DomainEvent } from 'src/shared/kernel/domain-event';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { RawClientInfoProps } from '../value-objects/client-info.value-object';
import { MoneyProps } from '../../../shared/domain/value-objects/money.value-object';

export interface OrderCreatedEventData {
  title: string;
  description: string;
  budget: MoneyProps;
  responses: number;
  clientInfo: RawClientInfoProps;
}

export class OrderCreatedEvent extends DomainEvent<OrderCreatedEventData> {
  public static readonly eventName = 'order.created';

  constructor(
    aggregateId: UniqueEntityID,
    eventData: OrderCreatedEventData,
    occurredAt?: Date,
    eventId?: string,
  ) {
    super(aggregateId, eventData, occurredAt, eventId);
  }
}
