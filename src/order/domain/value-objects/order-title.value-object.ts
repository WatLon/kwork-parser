import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface OrderTitleProps {
  value: string;
}

export class OrderTitle extends ValueObject<OrderTitleProps> {
  public static readonly MIN_LENGTH = 5;
  public static readonly MAX_LENGTH = 200;
  private constructor(props: OrderTitleProps) {
    super(props);
  }

  public static create(title: string): Result<OrderTitle> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(title, 'title'),
      Guard.againstEmptyString(title, 'title'),
      Guard.stringLength(
        title,
        OrderTitle.MIN_LENGTH,
        OrderTitle.MAX_LENGTH,
        'title',
      ),
    ]);

    if (!guardResult.succeeded)
      return Result.fail<OrderTitle>(guardResult.message!);

    return Result.ok<OrderTitle>(new OrderTitle({ value: title }));
  }

  public get value(): string {
    return this.props.value;
  }
}
