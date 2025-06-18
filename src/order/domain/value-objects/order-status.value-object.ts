import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export enum OrderStatusEnum {
  UNVIEWED = 'unviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface OrderStatusProps {
  value: OrderStatusEnum;
}

export class OrderStatus extends ValueObject<OrderStatusProps> {
  private constructor(props: OrderStatusProps) {
    super(props);
  }

  public static create(value: OrderStatusEnum): Result<OrderStatus> {
    return Result.ok(new OrderStatus({ value }));
  }

  get value(): OrderStatusEnum {
    return this.props.value;
  }

  public isUnviewed(): boolean {
    return this.props.value === OrderStatusEnum.UNVIEWED;
  }
  public isRejected(): boolean {
    return this.props.value === OrderStatusEnum.REJECTED;
  }
  public isApproved(): boolean {
    return this.props.value === OrderStatusEnum.APPROVED;
  }
}
