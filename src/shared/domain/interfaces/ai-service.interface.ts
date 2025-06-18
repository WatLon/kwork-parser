import { Result } from 'src/shared/kernel/result';

export enum AnalysisVerdict {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface TextForAnalysisDto {
  prompt: string;
}

export interface IAiService {
  getVerdictFor(prompt: string): Promise<Result<AnalysisVerdict>>;
}
