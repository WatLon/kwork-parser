export interface ApproveOrderCommandProps {
  orderId: string;
}

export class ApproveOrderCommand {
  public readonly orderId: string;
  constructor(props: ApproveOrderCommandProps) {
    this.orderId = props.orderId;
  }
}
