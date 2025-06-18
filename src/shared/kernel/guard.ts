export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(results: IGuardResult[]): IGuardResult {
    for (const result of results) {
      if (result.succeeded === false) return result;
    }
    return { succeeded: true };
  }
  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        message: `${argumentName} is null or undefined`,
      };
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.succeeded === false) return result;
    }
    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validValues: readonly any[],
    argumentName: string,
  ): IGuardResult {
    let isValid = false;

    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
        break;
      }
    }

    if (isValid) {
      return { succeeded: true };
    }

    return {
      succeeded: false,
      message: `${argumentName} isn't one of the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
    };
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): IGuardResult {
    const isInRange = num >= min && num <= max;

    if (!isInRange) {
      return {
        succeeded: false,
        message: `${argumentName} must be between ${min} and ${max}. Got ${num}.`,
      };
    }

    return { succeeded: true };
  }

  public static allInRange(
    nums: number[],
    min: number,
    max: number,
    argumentName: string,
  ): IGuardResult {
    for (const num of nums) {
      const result = this.inRange(num, min, max, argumentName);
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
    argumentName: string,
  ): IGuardResult {
    if (actualValue <= minValue) {
      return {
        succeeded: false,
        message: `${argumentName} must be greater than ${minValue}. Got ${actualValue}.`,
      };
    }
    return {
      succeeded: true,
    };
  }

  public static againstEmptyString(
    value: string,
    argumentName: string,
  ): IGuardResult {
    if (value.trim().length === 0) {
      return {
        succeeded: false,
        message: `${argumentName} must be a non-empty string. Got ${value}.`,
      };
    }

    return {
      succeeded: true,
    };
  }

  public static stringLength(
    value: string,
    min: number,
    max: number,
    argumentName: string,
  ): IGuardResult {
    const length = value.trim().length;

    if (length < min || length > max) {
      return {
        succeeded: false,
        message: `${argumentName} must be between ${min} and ${max} characters long. Got ${length}.`,
      };
    }

    return {
      succeeded: true,
    };
  }

  public static match(
    value: string,
    regex: RegExp,
    argumentName: string,
  ): IGuardResult {
    if (!regex.test(value)) {
      return {
        succeeded: false,
        message: `${argumentName} doesn't match the required pattern. Got ${value}.`,
      };
    }

    return {
      succeeded: true,
    };
  }
}
