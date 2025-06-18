import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface OrderDescriptionProps {
  value: string;
}

export class OrderDescription extends ValueObject<OrderDescriptionProps> {
  public static readonly MIN_LENGTH = 20;
  public static readonly MAX_LENGTH = 10000;

  private constructor(props: OrderDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<OrderDescription> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(description, 'description'),
      Guard.againstEmptyString(description, 'description'),
      Guard.stringLength(
        description,
        OrderDescription.MIN_LENGTH,
        OrderDescription.MAX_LENGTH,
        'description',
      ),
    ]);

    if (!guardResult.succeeded)
      return Result.fail<OrderDescription>(guardResult.message!);

    const sanitized = this.sanitize(description);
    return Result.ok<OrderDescription>(
      new OrderDescription({ value: sanitized }),
    );
  }

  private static sanitize(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  public get value(): string {
    return this.props.value;
  }

  public get wordCount(): number {
    return this.props.value.split(/\s+/).filter((word) => word.length > 0)
      .length;
  }

  public contains(keyword: string): boolean {
    return this.props.value.toLowerCase().includes(keyword.toLowerCase());
  }

  public extractKeywords(): string[] {
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
    ]);
    const words = this.props.value
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !commonWords.has(word));

    return [...new Set(words)];
  }
}
