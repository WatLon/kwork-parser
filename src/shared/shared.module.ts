import { Global, Module, Provider } from '@nestjs/common';
import { TransactionImpl } from './infrastructure/persistence/transaction/transaction.impl';
import { INJECTION_TOKENS } from 'src/shared/constants/injection-tokens';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { NestJsEventBus } from './infrastructure/event-bus/nestjs-event-bus';
import { OpenAiVerdictService } from './infrastructure/services/openai-verdict.service';

const transactionProvider: Provider = {
  provide: INJECTION_TOKENS.TRANSACTION,
  useFactory: (dataSource: DataSource) => new TransactionImpl(dataSource),
  inject: [getDataSourceToken()],
};

const eventBusProvider: Provider = {
  provide: INJECTION_TOKENS.EVENT_BUS,
  useClass: NestJsEventBus,
};

const aiServiceProvider: Provider = {
  provide: INJECTION_TOKENS.AI_SERVICE,
  useClass: OpenAiVerdictService,
};
@Global()
@Module({
  providers: [transactionProvider, eventBusProvider, aiServiceProvider],
  exports: [transactionProvider, eventBusProvider, aiServiceProvider],
})
export class SharedModule {}
