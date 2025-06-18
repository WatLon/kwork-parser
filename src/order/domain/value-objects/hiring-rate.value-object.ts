import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface HiringRateProps {
  value: number;
}

export class HiringRate extends ValueObject<HiringRateProps> {
  private constructor(props: HiringRateProps) {
    super(props);
  }

  public static create(value: number): Result<HiringRate> {
    const guardResult = Guard.inRange(value, 0, 100, 'hiringRate');

    if (!guardResult.succeeded) {
      return Result.fail(guardResult.message!);
    }

    return Result.ok(new HiringRate({ value }));
  }

  get value(): number {
    return this.props.value;
  }
}
