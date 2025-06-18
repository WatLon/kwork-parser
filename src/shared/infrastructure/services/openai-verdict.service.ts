import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  AnalysisVerdict,
  IAiService,
} from 'src/shared/domain/interfaces/ai-service.interface';
import { Result } from 'src/shared/kernel/result';
import { getErrorStack } from 'src/shared/utils/error.utils';
import { z } from 'zod';

const AiVerdictSchema = z.object({
  verdict: z.enum(['APPROVED', 'REJECTED']),
});

@Injectable()
export class OpenAiVerdictService implements IAiService {
  private readonly logger = new Logger(OpenAiVerdictService.name);
  private readonly openAi: OpenAI;
  private readonly openAiModel: string;

  constructor(private readonly configService: ConfigService) {
    this.openAi = new OpenAI({
      baseURL: this.configService.get<string>('OPENAI_API_URL'),
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
    this.openAiModel = this.configService.getOrThrow<string>('OPENAI_MODEL');
  }

  async getVerdictFor(prompt: string): Promise<Result<AnalysisVerdict>> {
    try {
      const response = await this.openAi.chat.completions.create({
        model: this.openAiModel,

        messages: [{ role: 'user', content: prompt }],
      });

      const answer = response.choices[0].message.content;

      if (!answer) {
        this.logger.warn('OpenAI returned no content in a response.');
        return Result.fail('OpenAI returned an empty response');
      }

      const parsed = AiVerdictSchema.safeParse(JSON.parse(answer));

      if (!parsed.success) {
        this.logger.error('Failed to validate OpenAI response schema', {
          error: parsed.error.format(),
          response: answer,
        });
        return Result.fail('Invalid response format from OpenAI');
      }

      const verdict = parsed.data.verdict as AnalysisVerdict;

      return Result.ok(verdict);
    } catch (error) {
      this.logger.error(
        `Failed to get verdict from OpenAI: ${getErrorStack(error)}`,
      );
      return Result.fail('Failed to get verdict from OpenAI');
    }
  }
}
