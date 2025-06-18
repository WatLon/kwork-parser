export interface RejectOrderCommandProps {
  orderId: string;
}

export class RejectOrderCommand {
  public readonly orderId: string;

  constructor(props: RejectOrderCommandProps) {
    this.orderId = props.orderId;
  }
}
