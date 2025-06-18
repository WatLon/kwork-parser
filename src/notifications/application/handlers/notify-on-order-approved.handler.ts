import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderApprovedEvent } from 'src/order/domain/events/order-approved.event';
import { OrderApprovedNotification } from '../notifications/order-approved.notification';
import { NotificationManager } from '../services/notification-manager';

@Injectable()
export class NotifyOnOrderApprovedHandler {
  private readonly logger = new Logger(NotifyOnOrderApprovedHandler.name);
  constructor(private readonly notificationManager: NotificationManager) {}

  @OnEvent(OrderApprovedEvent.eventName)
  async handler(event: OrderApprovedEvent): Promise<void> {
    this.logger.log(`Handling event ${OrderApprovedEvent.eventName}`);

    const notification = new OrderApprovedNotification(event.eventData);

    this.logger.log(
      `Sending notification about order ${event.aggregateId} approval`,
    );

    await this.notificationManager.dispatch(notification);

    this.logger.log(
      `Notification about order ${event.aggregateId} approval sent`,
    );
  }
}
