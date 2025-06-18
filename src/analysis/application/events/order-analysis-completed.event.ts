import { AnalysisVerdict } from 'src/shared/domain/interfaces/ai-service.interface';
import { DomainEvent } from 'src/shared/kernel/domain-event';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';

export interface OrderAnalysisCompletedEventData {
  orderId: string;
  analysisVerdict: AnalysisVerdict;
}

export class OrderAnalysisCompletedEvent extends DomainEvent<OrderAnalysisCompletedEventData> {
  public static readonly eventName = 'analysis.order_completed';

  constructor(eventData: OrderAnalysisCompletedEventData) {
    const aggregateId = new UniqueEntityID(eventData.orderId);
    super(aggregateId, eventData);
  }
}
