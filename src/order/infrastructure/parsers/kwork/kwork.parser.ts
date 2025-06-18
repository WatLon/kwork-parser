import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

import { IngestOrderCommand } from 'src/order/application/commands/ingest-order.command';
import { IOrderParser } from 'src/order/application/ports/order-parser';
import {
  KworkApiResponseDto,
  KworkApiResponseDtoSchema,
  KworkProjectDto,
  KworkProjectDtoSchema,
} from './kwork-api-response.dto';
import { getErrorMessage } from 'src/shared/utils/error.utils';
import { retry } from 'src/shared/utils/retry.utils';

@Injectable()
export class KworkParser implements IOrderParser {
  private readonly logger = new Logger(KworkParser.name);
  private readonly KWORK_API_URL: string;
  private readonly KWORK_COOKIE: string;
  private readonly KWORK_USER_AGENT: string;

  private readonly THROTTLE_MS = 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.KWORK_API_URL = this.configService.getOrThrow<string>('KWORK_API_URL');
    this.KWORK_COOKIE = this.configService.getOrThrow<string>('KWORK_COOKIE');
    this.KWORK_USER_AGENT =
      this.configService.getOrThrow<string>('KWORK_USER_AGENT');
  }

  async parse(): Promise<IngestOrderCommand[]> {
    this.logger.log('Starting Kwork API request...');
    const projects: KworkProjectDto[] = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      try {
        const response = await this.fetchProjectsFromApi(page);

        if (!response.success || !response.data?.pagination?.data) {
          this.logger.warn(
            `Malformed or unsuccessful response at page #${page}`,
          );
          page += 1;
          continue;
        }

        const pageProjects = response.data.pagination.data;
        const validProjects: KworkProjectDto[] = [];

        pageProjects.forEach((project, idx) => {
          const parsed = KworkProjectDtoSchema.safeParse(project);
          if (!parsed.success) {
            this.logger.warn(
              `Invalid order at page ${page}, index ${idx}: ${parsed.error.toString()}`,
            );
            return;
          }
          validProjects.push(parsed.data);
        });

        projects.push(...validProjects);

        hasNext = !!response.data.pagination.next_page_url;
        page += 1;
      } catch (error) {
        this.logger.warn(
          `Page #${page} failed to load/validate, skipping: ${getErrorMessage(error)}`,
        );
        page += 1;
      } finally {
        await new Promise((resolve) => setTimeout(resolve, this.THROTTLE_MS));
      }
    }
    this.logger.log(
      `Successfully processed ${projects.length} valid projects.`,
    );
    return projects.map((project) => this.mapToCommand(project));
  }

  private async fetchProjectsFromApi(
    page: number,
  ): Promise<KworkApiResponseDto> {
    const formData = new FormData();
    formData.append('a', '1');
    formData.append('page', page.toString());

    const headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      Connection: 'keep-alive',
      Cookie: this.KWORK_COOKIE,
      Origin: 'https://kwork.ru',
      Referer: 'https://kwork.ru/projects?a=1',
      'User-Agent': this.KWORK_USER_AGENT,
      'X-Requested-With': 'XMLHttpRequest',
    };

    return retry<KworkApiResponseDto>(
      async () => {
        const { data } = await firstValueFrom(
          this.httpService.post<KworkApiResponseDto>(
            this.KWORK_API_URL,
            formData,
            { headers },
          ),
        );
        const parsed = KworkApiResponseDtoSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error(
            'API response validation failed: ' + parsed.error.toString(),
          );
        }
        return parsed.data;
      },
      3,
      1200,
    );
  }

  private mapToCommand(project: KworkProjectDto): IngestOrderCommand {
    return new IngestOrderCommand({
      externalId: `kwork-${project.id}`,
      externalUrl: `https://kwork.ru/projects/${project.id}`,
      title: project.name,
      description: project.description,
      budgetText: `${parseFloat(project.priceLimit)} RUB`,
      responses: project.kwork_count || 0,
      clientName: project.user.username,
      clientProjectCount: parseInt(project.user.data.wants_count, 10) || 0,
      clientHiringRate:
        parseInt(project.user.data.wants_hired_percent, 10) || 0,
    });
  }
}
