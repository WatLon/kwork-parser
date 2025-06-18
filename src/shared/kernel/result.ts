export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value: T | null;
  private readonly _error: string | null;

  private constructor(
    isSuccess: boolean,
    error: string | null,
    value: T | null,
  ) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error("Can't get value from failed result");
    }
    return this._value as T;
  }

  get error(): string {
    if (this.isSuccess) {
      throw new Error("Can't get error from success result");
    }
    return this._error as string;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value || null);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error, null);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
