import { Module } from '@nestjs/common';
import { RequestAnalysisOnOrderCreatedHandler } from './application/handlers/request-analysis-on-order-creater.handler';
import { RequestAnalysisUseCase } from './application/use-cases/request-analysis.use-case';

@Module({
  providers: [RequestAnalysisOnOrderCreatedHandler, RequestAnalysisUseCase],
})
export class AnalysisModule {}
