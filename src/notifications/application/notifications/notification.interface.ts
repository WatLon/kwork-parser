import { ChannelName } from '../ports/notification-channel.interface';

export interface INotification {
  formatFor(channelName: ChannelName): string | object;
}
