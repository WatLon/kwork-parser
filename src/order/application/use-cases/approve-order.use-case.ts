import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApproveOrderCommand } from '../commands/approve-order.command';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { ITransaction } from 'src/shared/domain/interfaces/transaction.interface';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { Result } from 'src/shared/kernel/result';
import { Order } from 'src/order/domain/entities/order.entity';
import { IEventBus } from 'src/shared/kernel/event-bus.interface';

@Injectable()
export class ApproveOrderUseCase {
  private readonly logger = new Logger(ApproveOrderUseCase.name);
  constructor(
    @Inject(INJECTION_TOKENS.TRANSACTION)
    private readonly transaction: ITransaction,
    @Inject(INJECTION_TOKENS.EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: ApproveOrderCommand): Promise<Result<void>> {
    this.logger.log(`Approving order ${command.orderId}`);

    const transactionResult = await this.transaction.execute<
      Result<Order | void>
    >(async (unitOfWork) => {
      const orderRepository = unitOfWork.orderRepository;

      const order = await orderRepository.findById(
        new UniqueEntityID(command.orderId),
      );

      if (!order) {
        this.logger.error(`Order ${command.orderId} not found`);
        return Result.fail<void>('Order not found');
      }

      this.logger.log(`Found order ${command.orderId}`);

      const approveResult = order.approve();
      if (approveResult.isFailure) {
        this.logger.error(
          `Failed to approve order ${command.orderId}: ${approveResult.error}`,
        );
        return Result.fail<void>(approveResult.error);
      }

      this.logger.log(`Approved order ${command.orderId}`);

      await orderRepository.save(order);

      this.logger.log(`Saved order ${command.orderId}`);

      return Result.ok(order);
    });

    if (transactionResult.isFailure) {
      this.logger.error(`Failed to approve order: ${transactionResult.error}`);
      return Result.fail<void>(transactionResult.error);
    }

    const order = transactionResult.value as Order;
    await this.eventBus.publishAll(order.domainEvents);
    order.clearEvents();

    this.logger.log(`Order ${command.orderId} has been approved.`);
    return Result.ok<void>();
  }
}
