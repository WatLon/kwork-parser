import { Injectable, Logger } from '@nestjs/common';
import { OrderAnalysisCompletedEvent } from 'src/analysis/application/events/order-analysis-completed.event';
import { AnalysisVerdict } from 'src/shared/domain/interfaces/ai-service.interface';
import { ApproveOrderUseCase } from '../use-cases/approve-order.use-case';
import { RejectOrderUseCase } from '../use-cases/reject-order.use-case';
import { ApproveOrderCommand } from '../commands/approve-order.command';
import { RejectOrderCommand } from '../commands/reject-order.command';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UpdateOrderStatusOnAnalysisCompletedHandler {
  private readonly logger = new Logger(
    UpdateOrderStatusOnAnalysisCompletedHandler.name,
  );
  constructor(
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    private readonly rejectOrderUseCase: RejectOrderUseCase,
  ) {}

  @OnEvent(OrderAnalysisCompletedEvent.eventName)
  async handle(event: OrderAnalysisCompletedEvent): Promise<void> {
    const { orderId, analysisVerdict } = event.eventData;

    this.logger.log(`Received order analysis completed event: ${orderId}`);

    if (analysisVerdict === AnalysisVerdict.APPROVED) {
      this.logger.log(`Order ${orderId} is approved`);
      await this.approveOrderUseCase.execute(
        new ApproveOrderCommand({ orderId }),
      );
    } else {
      this.logger.log(`Order ${orderId} is rejected`);
      await this.rejectOrderUseCase.execute(
        new RejectOrderCommand({ orderId }),
      );
    }
  }
}
