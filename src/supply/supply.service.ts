import { Injectable } from '@nestjs/common';

import { ChartService } from 'src/chart/chart.service';
import { Chart } from 'src/chart/chart.interface';
import { subHours } from 'date-fns';

@Injectable()
export class SupplyService {
  constructor(private readonly chartService: ChartService) {}

  getTotalSupplyForLastDay(address: string): Promise<Chart[]> {
    const yesterday = subHours(new Date(), 24);
    return this.chartService.findMany(address, yesterday.getTime());
  }
}
