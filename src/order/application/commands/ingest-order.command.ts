export interface IngestOrderCommandProps {
  title: string;
  description: string;
  clientName: string;
  clientProjectCount: number;
  clientHiringRate: number;
  responses: number;
  budgetText: string;
  externalId: string;
  externalUrl: string;
}

export class IngestOrderCommand {
  public readonly title: string;
  public readonly description: string;
  public readonly clientName: string;
  public readonly clientProjectCount: number;
  public readonly clientHiringRate: number;
  public readonly responses: number;
  public readonly budgetText: string;
  public readonly externalId: string;
  public readonly externalUrl: string;

  constructor(props: IngestOrderCommandProps) {
    this.title = props.title;
    this.description = props.description;
    this.clientName = props.clientName;
    this.clientProjectCount = props.clientProjectCount;
    this.clientHiringRate = props.clientHiringRate;
    this.responses = props.responses;
    this.budgetText = props.budgetText;
    this.externalId = props.externalId;
    this.externalUrl = props.externalUrl;
  }
}
