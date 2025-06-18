import { Inject, Injectable, Logger } from '@nestjs/common';
import { RejectOrderCommand } from '../commands/reject-order.command';
import { Result } from 'src/shared/kernel/result';
import { ITransaction } from 'src/shared/domain/interfaces/transaction.interface';
import { Order } from 'src/order/domain/entities/order.entity';
import { IEventBus } from 'src/shared/kernel/event-bus.interface';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';

@Injectable()
export class RejectOrderUseCase {
  private readonly logger = new Logger(RejectOrderUseCase.name);
  constructor(
    @Inject(INJECTION_TOKENS.TRANSACTION)
    private readonly transaction: ITransaction,
    @Inject(INJECTION_TOKENS.EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: RejectOrderCommand): Promise<Result<void>> {
    this.logger.log(`Rejecting order ${command.orderId}`);

    const transactionResult = await this.transaction.execute<
      Result<Order | void>
    >(async (unitOfWork) => {
      const orderRepository = unitOfWork.orderRepository;

      const order = await orderRepository.findById(
        new UniqueEntityID(command.orderId),
      );

      if (!order) {
        this.logger.error(
          `Order ${command.orderId} not found, aborting rejection.`,
        );
        return Result.fail<void>('Order not found');
      }

      this.logger.log(`Found order ${command.orderId}`);

      const rejectResult = order.reject();
      if (rejectResult.isFailure) {
        this.logger.error(
          `Failed to reject order ${command.orderId}: ${rejectResult.error}`,
        );
        return Result.fail<void>(rejectResult.error);
      }

      this.logger.log(`Rejected order ${command.orderId}`);

      await orderRepository.save(order);

      this.logger.log(`Saved order ${command.orderId}`);

      return Result.ok(order);
    });

    if (transactionResult.isFailure) {
      this.logger.error(`Failed to reject order: ${transactionResult.error}`);
      return Result.fail<void>(transactionResult.error);
    }

    const order = transactionResult.value as Order;
    await this.eventBus.publishAll(order.domainEvents);
    order.clearEvents();

    this.logger.log(`Order ${command.orderId} has been rejected.`);
    return Result.ok();
  }
}
