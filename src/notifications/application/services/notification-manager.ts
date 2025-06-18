import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ChannelName,
  INotificationChannel,
} from 'src/notifications/application/ports/notification-channel.interface';
import { INotification } from 'src/notifications/application/notifications/notification.interface';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';

@Injectable()
export class NotificationManager {
  private readonly logger = new Logger(NotificationManager.name);
  private channels: Map<ChannelName, INotificationChannel> = new Map();

  constructor(
    @Inject(INJECTION_TOKENS.NOTIFICATION_CHANNELS)
    notificationChannels: INotificationChannel[],
  ) {
    notificationChannels.forEach((channel) =>
      this.channels.set(channel.channelName, channel),
    );
  }

  async dispatch(
    notification: INotification,
    toChannels?: ChannelName[],
  ): Promise<void> {
    const targetChannels = toChannels
      ? (toChannels
          .map((channelName) => this.channels.get(channelName))
          .filter(Boolean) as INotificationChannel[])
      : [...this.channels.values()];

    if (targetChannels.length === 0) {
      this.logger.warn(`No target channels found for dispatch.`);
      return;
    }

    this.logger.log(
      `Sending notification to ${targetChannels.length} channels.`,
    );

    const promises = targetChannels.map((channel, index) => {
      this.logger.log(
        `Sending to channel #${index + 1} ${channel.channelName}`,
      );
      return channel.send(notification);
    });

    await Promise.allSettled(promises);

    this.logger.log('All notifications have been sent.');
  }
}
