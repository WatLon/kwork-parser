import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from 'src/shared/kernel/domain-event';
import { IEventBus } from 'src/shared/kernel/event-bus.interface';

@Injectable()
export class NestJsEventBus implements IEventBus {
  private readonly logger = new Logger(NestJsEventBus.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventConstructor = event.constructor as unknown as {
      eventName: string;
    };
    this.logger.log(`Publishing event ${eventConstructor.eventName}`);
    await this.eventEmitter.emitAsync(eventConstructor.eventName, event);
    this.logger.log(`Event ${eventConstructor.eventName} published`);
  }

  async publishAll<T extends DomainEvent>(events: T[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
