import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface UrlProps {
  value: string;
}

export class Url extends ValueObject<UrlProps> {
  private constructor(props: UrlProps) {
    super(props);
  }

  public static create(value: string): Result<Url> {
    const guardResult = Guard.combine([
      Guard.againstEmptyString(value, 'url string'),
    ]);

    if (!guardResult.succeeded) return Result.fail(guardResult.message!);
    if (!Url.isValidUrl(value)) return Result.fail('Invalid url');

    return Result.ok(new Url({ value }));
  }

  public static isValidUrl(url: string): boolean {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  public get value(): string {
    return this.props.value;
  }
}
