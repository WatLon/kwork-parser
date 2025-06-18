import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';
import { HiringRate } from './hiring-rate.value-object';
import { Guard } from 'src/shared/kernel/guard';

export interface ClientInfoProps {
  name: string;
  projectCount: number;
  hiringRate: HiringRate;
}

export interface RawClientInfoProps {
  name: string;
  projectCount: number;
  hiringRate: number;
}

export class ClientInfo extends ValueObject<ClientInfoProps> {
  private constructor(props: ClientInfoProps) {
    super(props);
  }

  public static create(props: ClientInfoProps): Result<ClientInfo> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(props.name, 'name'),
      Guard.againstNullOrUndefined(props.projectCount, 'projectCount'),
      Guard.againstNullOrUndefined(props.hiringRate, 'hiringRate'),
    ]);

    if (!guardResult.succeeded) return Result.fail(guardResult.message!);
    return Result.ok(new ClientInfo(props));
  }

  public static createFromRawData(
    rawData: RawClientInfoProps,
  ): Result<ClientInfo> {
    const name = rawData.name;
    const projectCount = rawData.projectCount;
    const hiringRateResult = HiringRate.create(rawData.hiringRate);
    if (hiringRateResult.isFailure) {
      return Result.fail(hiringRateResult.error);
    }

    return ClientInfo.create({
      name,
      projectCount,
      hiringRate: hiringRateResult.value,
    });
  }

  public get name(): string {
    return this.props.name;
  }

  public get projectCount(): number {
    return this.props.projectCount;
  }

  public get hiringRate(): HiringRate {
    return this.props.hiringRate;
  }
}
