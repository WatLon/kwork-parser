import { DomainEvent } from 'src/shared/kernel/domain-event';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { MoneyProps } from '../../../shared/domain/value-objects/money.value-object';
import { RawClientInfoProps } from '../value-objects/client-info.value-object';

export interface OrderApprovedEventData {
  title: string;
  description: string;
  budget: MoneyProps;
  responses: number;
  clientInfo: RawClientInfoProps;
  externalUrl: string;
}

export class OrderApprovedEvent extends DomainEvent<OrderApprovedEventData> {
  public static eventName = 'order.approved';

  constructor(aggregateId: UniqueEntityID, eventData: OrderApprovedEventData) {
    super(aggregateId, eventData);
  }
}
