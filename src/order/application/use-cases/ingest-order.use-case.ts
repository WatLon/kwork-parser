import { Result } from 'src/shared/kernel/result';
import { IngestOrderCommand } from '../commands/ingest-order.command';
import { Order } from 'src/order/domain/entities/order.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { ITransaction } from 'src/shared/domain/interfaces/transaction.interface';
import { getErrorMessage } from 'src/shared/utils/error.utils';
import { IEventBus } from 'src/shared/kernel/event-bus.interface';
import { IOrderIngestionPolicy } from '../policies/order-ingestion.policy';

@Injectable()
export class IngestOrderUseCase {
  private readonly logger = new Logger(IngestOrderUseCase.name);
  constructor(
    @Inject(INJECTION_TOKENS.TRANSACTION)
    private readonly transaction: ITransaction,
    @Inject(INJECTION_TOKENS.EVENT_BUS)
    private readonly eventBus: IEventBus,
    @Inject(INJECTION_TOKENS.ORDER_INGESTION_POLICY)
    private readonly orderIngestionPolicy: IOrderIngestionPolicy,
  ) {}
  async execute(command: IngestOrderCommand): Promise<Result<Order>> {
    try {
      this.logger.log(`Ingesting order ${command.externalId}`);
      const transactionResult = await this.transaction.execute<Result<Order>>(
        async (unitOfWork) => {
          const orderRepository = unitOfWork.orderRepository;
          const existingOrder = await orderRepository.findByExternalId(
            command.externalId,
          );
          if (existingOrder) {
            this.logger.log(
              `Order ${command.externalId} already exists, skipping ingestion.`,
            );
            return Result.fail('Order already exists');
          }

          const orderResult = Order.createFromRawData(command);

          if (orderResult.isFailure) {
            return Result.fail(orderResult.error);
          }

          const order = orderResult.value;

          if (!this.orderIngestionPolicy.isSatisfiedBy(order)) {
            return Result.fail('Order ingestion policy not satisfied');
          }

          await orderRepository.save(order);

          this.logger.log(`Order ${command.externalId} ingested successfully.`);

          return orderResult;
        },
      );

      if (transactionResult.isSuccess) {
        const order = transactionResult.value;

        await this.eventBus.publishAll(order.domainEvents);
        order.clearEvents();
      }

      return transactionResult;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.logger.error(
        `An error occurred while ingesting the order ${command.externalId}: ${errorMessage}`,
      );
      return Result.fail(
        `An error occurred while ingesting the order: ${errorMessage}`,
      );
    }
  }
}
