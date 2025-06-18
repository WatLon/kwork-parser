import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { INotificationChannel } from 'src/notifications/application/ports/notification-channel.interface';
import { INotification } from 'src/notifications/application/notifications/notification.interface';
import { getErrorMessage, isAxiosError } from 'src/shared/utils/error.utils';

@Injectable()
export class TelegramNotificationChannel implements INotificationChannel {
  public readonly channelName = 'telegram';
  private readonly logger = new Logger(TelegramNotificationChannel.name);

  private readonly botToken: string;
  private readonly chatId: string;

  private readonly THROTTLE_MS = 1000;
  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.botToken = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = configService.getOrThrow<string>('TELEGRAM_CHAT_ID');
  }

  async send(notification: INotification): Promise<void> {
    this.logger.log('Preparing to send a Telegram notification');
    const message = notification.formatFor(this.channelName);

    console.log('RAW HEX:', Buffer.from(message as string).toString('hex'));

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const requestPayload = {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'MarkdownV2',
    };

    this.logger.debug(
      `Sending POST request to ${url.replaceAll(this.botToken, '<SECRETTED_BOT_TOKEN>')} with payload:`,
      requestPayload,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, requestPayload),
      );
      this.logger.log('Notification sent successfully', response?.data);
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error('Axios error', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
        });
      } else {
        this.logger.error('Unknown error', {
          message: getErrorMessage(error),
          error: error,
        });
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, this.THROTTLE_MS));
    }
  }
}
