import { IngestOrderCommand } from 'src/order/application/commands/ingest-order.command';

export interface IOrderParser {
  parse(): Promise<IngestOrderCommand[]>;
}
