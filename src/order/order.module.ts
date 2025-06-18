import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { KworkParser } from './infrastructure/parsers/kwork/kwork.parser';
import { TasksService } from './infrastructure/scheduling/tasks/task.service';
import { IngestOrderUseCase } from './application/use-cases/ingest-order.use-case';
import { HiringRatePolicy } from './domain/policies/hiring-rate.policy';
import { UpdateOrderStatusOnAnalysisCompletedHandler } from './application/handlers/update-order-status-on-order-analysis-completed.handler';
import { ApproveOrderUseCase } from './application/use-cases/approve-order.use-case';
import { RejectOrderUseCase } from './application/use-cases/reject-order.use-case';

@Module({
  providers: [
    UpdateOrderStatusOnAnalysisCompletedHandler,
    ApproveOrderUseCase,
    RejectOrderUseCase,
    {
      provide: INJECTION_TOKENS.ORDER_PARSER,
      useClass: KworkParser,
    },
    {
      provide: INJECTION_TOKENS.ORDER_INGESTION_POLICY,
      useClass: HiringRatePolicy,
    },
    TasksService,
    IngestOrderUseCase,
  ],
})
export class OrderModule {}
