import { v4 as uuid } from 'uuid';
import { UniqueEntityID } from './unique-entity-id';

export abstract class DomainEvent<T = any> {
  public readonly aggregateId: string;
  public readonly eventData: T;
  public readonly occurredAt: Date;
  public readonly eventId: string;
  constructor(
    aggregateId: UniqueEntityID,
    eventData: T,
    occurredAt?: Date,
    eventId?: string,
  ) {
    this.aggregateId = aggregateId.toString();
    this.eventData = Object.freeze(eventData);
    this.occurredAt = occurredAt ?? new Date();
    this.eventId = eventId ?? uuid();
  }
}
