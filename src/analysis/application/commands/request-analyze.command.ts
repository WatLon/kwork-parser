import { Money } from 'src/shared/domain/value-objects/money.value-object';

interface CommandClientInfoProps {
  name: string;
  projectCount: number;
  hiringRate: number;
}

export interface RequestAnalysisCommandProps {
  orderId: string;
  title: string;
  description: string;
  budget: Money;
  responses: number;
  clientInfo: CommandClientInfoProps;
}

export class RequestAnalysisCommand {
  public readonly orderId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly budget: Money;
  public readonly responses: number;
  public readonly clientInfo: CommandClientInfoProps;

  constructor(props: RequestAnalysisCommandProps) {
    this.orderId = props.orderId;
    this.title = props.title;
    this.description = props.description;
    this.budget = props.budget;
    this.responses = props.responses;
    this.clientInfo = props.clientInfo;
  }
}
