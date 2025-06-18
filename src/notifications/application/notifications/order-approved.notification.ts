import { ChannelName } from 'src/notifications/application/ports/notification-channel.interface';
import { INotification } from 'src/notifications/application/notifications/notification.interface';
import { OrderApprovedEventData } from 'src/order/domain/events/order-approved.event';
import {
  escapeMarkdownV2,
  normalizeTelegramText,
} from 'src/shared/utils/markdown.utils';

export class OrderApprovedNotification implements INotification {
  constructor(private readonly eventData: OrderApprovedEventData) {}

  formatFor(channelName: ChannelName): string | object {
    const notificationTitle = escapeMarkdownV2('✅ Новый одобренный заказ!');
    const title = escapeMarkdownV2(normalizeTelegramText(this.eventData.title));
    const description = escapeMarkdownV2(
      normalizeTelegramText(this.eventData.description),
    );
    const budget = escapeMarkdownV2(
      `${this.eventData.budget.value} ${this.eventData.budget.currency}`,
    );
    const responses = escapeMarkdownV2(String(this.eventData.responses));
    const clientInfo = this.eventData.clientInfo;
    const clientName = escapeMarkdownV2(clientInfo.name);
    const clientProjectCount = escapeMarkdownV2(
      String(clientInfo.projectCount),
    );
    const clientHiringRate = escapeMarkdownV2(String(clientInfo.hiringRate));
    const externalUrl = this.eventData.externalUrl;

    switch (channelName) {
      case 'telegram':
        return (
          `*${notificationTitle}*\n` +
          `\n*Название:* ${title}` +
          `\n*Бюджет:* ${budget}` +
          `\n*Описание:* ${description}` +
          `\n*Кол\\-во откликов:* ${responses}` +
          `\n*Информация о заказчике:*` +
          `\n  • Имя: ${clientName}` +
          `\n  • Кол\\-во заказов: ${clientProjectCount}` +
          `\n  • Процент найма: ${clientHiringRate}` +
          `\n*Ссылка:* [Открыть задание](${externalUrl})`
        );

      default:
        return `${notificationTitle}\n\nНазвание: ${title}\nБюджет: ${budget}`;
    }
  }
}
