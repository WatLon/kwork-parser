import { INotification } from '../notifications/notification.interface';

export type ChannelName = 'telegram' | 'discord';

export interface INotificationChannel {
  readonly channelName: ChannelName;
  send(notification: INotification): Promise<void>;
}
