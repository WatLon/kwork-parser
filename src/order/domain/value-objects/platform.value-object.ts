import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface PlatformProps {
  value: string;
}

export class Platform extends ValueObject<PlatformProps> {
  public static readonly SUPPORTED_PLATFORMS = [
    'KWORK',
    'FREELANCE_RU',
    'UPWORK',
    'FIVERR',
  ] as const;

  private static readonly platformConfig = {
    KWORK: {
      name: 'Kwork',
      domain: 'kwork.ru',
      currency: 'RUB',
    },
    FREELANCE_RU: {
      name: 'Freelance.ru',
      domain: 'freelance.ru',
      currency: 'RUB',
    },
    UPWORK: {
      name: 'Upwork',
      domain: 'upwork.com',
      currency: 'USD',
    },
    FIVERR: {
      name: 'Fiverr',
      domain: 'fiverr.com',
      currency: 'USD',
    },
  };

  private constructor(props: PlatformProps) {
    super(props);
  }

  public static create(platform: string): Result<Platform> {
    const uppedPlatform = platform.toUpperCase();

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(platform, 'platform'),
      Guard.isOneOf(uppedPlatform, this.SUPPORTED_PLATFORMS, 'platform'),
    ]);
    if (!guardResult.succeeded)
      return Result.fail<Platform>(guardResult.message!);

    return Result.ok<Platform>(new Platform({ value: uppedPlatform }));
  }

  public get value(): string {
    return this.props.value;
  }

  public get name(): string {
    return Platform.platformConfig[
      this.props.value as keyof typeof Platform.platformConfig
    ].name;
  }

  public get domain(): string {
    return Platform.platformConfig[
      this.props.value as keyof typeof Platform.platformConfig
    ].domain;
  }

  public get defaultCurrency(): string {
    return Platform.platformConfig[
      this.props.value as keyof typeof Platform.platformConfig
    ].currency;
  }
}
