import { Result } from 'src/shared/kernel/result';
import { ValueObject } from 'src/shared/kernel/value-object.base';

export interface ResponsesCountProps {
  value: number;
}

export class ResponsesCount extends ValueObject<ResponsesCountProps> {
  private constructor(props: ResponsesCountProps) {
    super(props);
  }

  public static create(responsesCount: number): Result<ResponsesCount> {
    if (responsesCount < 0) {
      return Result.fail('Responses count cannot be negative');
    }
    return Result.ok(new ResponsesCount({ value: responsesCount }));
  }
}
