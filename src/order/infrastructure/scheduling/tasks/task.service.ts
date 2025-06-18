import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { getErrorStack } from 'src/shared/utils/error.utils';
import { IOrderParser } from 'src/order/application/ports/order-parser';
import { IngestOrderUseCase } from 'src/order/application/use-cases/ingest-order.use-case';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(INJECTION_TOKENS.ORDER_PARSER)
    private readonly orderParser: IOrderParser,
    private readonly ingestOrderUseCase: IngestOrderUseCase,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {}

  onApplicationBootstrap() {
    const jobName = 'orderParser';

    const cronExpression = this.configService.getOrThrow<string>(
      'ORDER_CRON_EXPRESSION',
    );

    if (!cronExpression) {
      this.logger.warn(
        `Cron expression for "${jobName}" is not defined. Job will not be scheduled.`,
      );
      return;
    }

    const job = new CronJob(cronExpression, async () => {
      this.logger.log(`Cron job "${jobName}" is being executed.`);
      await this.handleCron();
    });

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();

    this.logger.log(
      `Cron job "${jobName}" scheduled with expression: ${cronExpression}`,
    );
  }
  async handleCron() {
    this.logger.log('Starting hourly order parsing...');

    try {
      const rawOrders = await this.orderParser.parse();
      this.logger.log(`Parsed ${rawOrders.length} new orders.`);

      if (rawOrders.length === 0) {
        this.logger.log('No new orders to process.');
        return;
      }

      for (const orderCommand of rawOrders) {
        const result = await this.ingestOrderUseCase.execute(orderCommand);

        if (result.isFailure) {
          this.logger.warn(
            `Failed to ingest order ${orderCommand.externalId}: ${result.error}`,
          );
        } else {
          this.logger.log(
            `Successfully ingested order ${orderCommand.externalId}.`,
          );
        }
      }

      this.logger.log('Finished processing orders.');
    } catch (error) {
      const errorStack = getErrorStack(error);
      this.logger.error(
        'An error occurred during the parsing process',
        errorStack,
      );
    }
  }
}
