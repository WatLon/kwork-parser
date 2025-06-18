import { OrderCreatedEvent } from 'src/order/domain/events/order-created.event';
import { RequestAnalysisCommand } from '../commands/request-analyze.command';
import { RequestAnalysisUseCase } from '../use-cases/request-analysis.use-case';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { Money } from 'src/shared/domain/value-objects/money.value-object';

@Injectable()
export class RequestAnalysisOnOrderCreatedHandler {
  private readonly logger = new Logger(
    RequestAnalysisOnOrderCreatedHandler.name,
  );
  constructor(
    private readonly requestAnalysisUseCase: RequestAnalysisUseCase,
  ) {}

  @OnEvent(OrderCreatedEvent.eventName)
  async handle(event: OrderCreatedEvent) {
    this.logger.log(`Received ${OrderCreatedEvent.eventName} event.`);

    const { eventData } = event;

    const budgetResult = Money.create({
      value: eventData.budget.value,
      currency: eventData.budget.currency,
    });

    if (budgetResult.isFailure) {
      this.logger.error(budgetResult.error);
    }

    this.logger.log('Creating request analysis command.');
    const budget = budgetResult.value;

    const requestAnalysisCommand = new RequestAnalysisCommand({
      orderId: event.aggregateId,
      ...event.eventData,
      budget,
    });

    this.logger.log('Executing request analysis use case.');
    await this.requestAnalysisUseCase.execute(requestAnalysisCommand);
  }
}
