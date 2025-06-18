import { IEventBus } from 'src/shared/kernel/event-bus.interface';
import { RequestAnalysisCommand } from '../commands/request-analyze.command';
import { IAiService } from 'src/shared/domain/interfaces/ai-service.interface';
import { OrderAnalysisCompletedEvent } from '../events/order-analysis-completed.event';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';

@Injectable()
export class RequestAnalysisUseCase {
  private readonly logger = new Logger(RequestAnalysisUseCase.name);
  constructor(
    @Inject(INJECTION_TOKENS.AI_SERVICE)
    private readonly IAiService: IAiService,
    @Inject(INJECTION_TOKENS.EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: RequestAnalysisCommand): Promise<void> {
    this.logger.log('Executing request analysis command.');

    // TODO: Вынести фабрику промптов
    const prompt = `Твоя задача - оценить релевантность заказа с фриланса.\nНазвание заказа: ${command.title}\nОписание заказа: ${command.description}\nЦена заказа: ${command.budget.value + command.budget.currency}\nКол-во отликов других исполнителей на заказ: ${command.responses}\nКол-во опубликованных заказов заказчика: ${command.clientInfo.projectCount}\nПроцент найма заказчика на эти заказы: ${command.clientInfo.hiringRate}. В ответе напиши ТОЛЬКО КОРРЕКТНЫЙ JSON по типу { "verdict": "APPROVED" | "REJECTED" }`;

    this.logger.debug('Generated prompt for AI analysis', { prompt });

    const aiAnalysisResult = await this.IAiService.getVerdictFor(prompt);

    if (aiAnalysisResult.isFailure) {
      this.logger.error('AI analysis failed', {
        error: aiAnalysisResult.error,
      });
      return;
    }

    this.logger.log('AI analysis succeeded', {
      verdict: aiAnalysisResult.value,
    });

    await this.eventBus.publish(
      new OrderAnalysisCompletedEvent({
        orderId: command.orderId,
        analysisVerdict: aiAnalysisResult.value,
      }),
    );

    this.logger.log('Published OrderAnalysisCompletedEvent');
  }
}
