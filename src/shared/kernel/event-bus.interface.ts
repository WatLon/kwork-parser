import { DomainEvent } from './domain-event';

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  publishAll<T extends DomainEvent>(events: T[]): Promise<void>;
}
