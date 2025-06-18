import { Guard } from 'src/shared/kernel/guard';
import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface MoneyProps {
  value: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  public static readonly SUPPORTED_CURRENCIES = ['RUB', 'USD', 'EUR'];
  private static readonly currencyMap: Map<string, string> = new Map([
    ['₽', 'RUB'],
    ['$', 'USD'],
    ['€', 'EUR'],
  ]);

  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(props: MoneyProps): Result<Money> {
    const value = props.value;
    const currency = props.currency;

    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(value, 'value'),
      Guard.againstNullOrUndefined(currency, 'currency'),
      Guard.isOneOf(currency, this.SUPPORTED_CURRENCIES, 'currency'),
    ]);

    if (!guardResult.succeeded) return Result.fail<Money>(guardResult.message!);

    return Result.ok<Money>(new Money({ value, currency }));
  }

  public static createFromString(text: string): Result<Money> {
    const guardResult = Guard.againstEmptyString(text, 'text');

    if (!guardResult.succeeded) {
      return Result.fail<Money>(guardResult.message!);
    }

    const allSymbols = [
      ...this.SUPPORTED_CURRENCIES,
      ...this.currencyMap.keys(),
    ].join('|');
    const currencyRegex = new RegExp(`(${allSymbols})`, 'i');
    const currencyMatch = text.match(currencyRegex);

    if (!currencyMatch) {
      return Result.fail<Money>(`Could not determine currency from "${text}"`);
    }

    const foundCurrency = currencyMatch[0];
    const currencyCode = this.normalizeCurrency(foundCurrency);

    const amountString = text
      .replace(currencyCode, '')
      .replace(/[^\d.,]+/g, '')
      .replace(',', '.');

    if (amountString === '') {
      return Result.fail<Money>(`Could not determine amount from "${text}"`);
    }

    const numberAmount = Number(amountString);

    if (isNaN(numberAmount)) {
      return Result.fail<Money>('Invalid amount');
    }

    return Money.create({ value: numberAmount, currency: currencyCode });
  }

  private static normalizeCurrency(currency: string): string {
    const upperCurrency = currency.toUpperCase();
    const mappedCurrency = this.currencyMap.get(upperCurrency);

    if (mappedCurrency) {
      return mappedCurrency;
    }

    return upperCurrency;
  }
  public get value(): number {
    return this.props.value;
  }

  public get currency(): string {
    return this.props.currency;
  }

  public getProps(): MoneyProps {
    return this.props;
  }

  public toString(): string {
    return `${this.value} ${this.currency}`;
  }

  public add(money: Money): Result<Money> {
    if (money.currency !== this.currency) {
      return Result.fail<Money>('Currencies must be the same!');
    }

    return Result.ok<Money>(
      new Money({ value: this.value + money.value, currency: this.currency }),
    );
  }

  public subtract(money: Money): Result<Money> {
    if (money.currency !== this.currency) {
      return Result.fail<Money>('Currencies must be the same!');
    }

    if (this.value < money.value) {
      return Result.fail<Money>('Insufficient funds');
    }

    return Result.ok<Money>(
      new Money({ value: this.value - money.value, currency: this.currency }),
    );
  }
}
