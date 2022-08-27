import { HhData } from './../top-page/top-page.model';
import { HhResponse } from './hh.models';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { API_URL, SALARY } from './hh.constants';

@Injectable()
export class HhService {
  private token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly htttpService: HttpService,
  ) {
    this.token = this.configService.get('HH_TOKEN') ?? '';
  }

  async getData(text: string) {
    try {
      const { data } = await this.htttpService
        .get<HhResponse>(API_URL.vacancies, {
          params: {
            text,
            clusters: true,
          },
          headers: {
            'User-Agent': 'NotFound/0.0 (sinedviper@gmail.com)',
            Authorization: 'Bearer ' + this.token,
          },
        })
        .toPromise();
      return this.parseData(data);
    } catch (e) {
      Logger.error(e);
    }
  }

  private parseData(data: HhResponse): HhData {
    const salaryCluster = data.clusters.find((c) => c.id == SALARY);
    if (!salaryCluster) {
      throw new Error('Not found cluster');
    }
    const juniorSalary = this.getSalaryFromString(salaryCluster.items[1].name);
    const middleSalary = this.getSalaryFromString(
      salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name,
    );
    const seniorSalary = this.getSalaryFromString(
      salaryCluster.items[Math.ceil(salaryCluster.items.length - 1)].name,
    );

    return {
      count: data.found,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    };
  }

  private getSalaryFromString(s: string): number {
    const numberRegExp = /(\d+)/g;
    const res = s.match(numberRegExp);
    if (!res) {
      return 0;
    }
    return Number(res[0]);
  }
}
