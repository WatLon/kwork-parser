import { Module } from '@nestjs/common';
import { TelegramNotificationChannel } from './infrastructure/channels/telegram/telegram-notification.channel';
import { NotifyOnOrderApprovedHandler } from './application/handlers/notify-on-order-approved.handler';
import { NotificationManager } from './application/services/notification-manager';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { INotificationChannel } from './application/ports/notification-channel.interface';

const channelProviders = [TelegramNotificationChannel];

@Module({
  providers: [
    ...channelProviders,
    NotifyOnOrderApprovedHandler,
    NotificationManager,
    {
      provide: INJECTION_TOKENS.NOTIFICATION_CHANNELS,

      useFactory: (...channels: INotificationChannel[]) => channels,

      inject: channelProviders,
    },
  ],
})
export class NotificationsModule {}
