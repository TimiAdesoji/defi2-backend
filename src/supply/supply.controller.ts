import { Controller, Get, Param, ForbiddenException } from '@nestjs/common';

import { Chart } from 'src/chart/chart.interface';

import { application } from '../config';
import { Token } from './supply.interface';
import { SupplyService } from './supply.service';

@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get(':token')
  getToTalSupply(@Param('token') token: Token): Promise<Chart[]> {
    const address = application.contractAddress[token];
    if (!address) {
      throw new ForbiddenException('Token not supported');
    }
    return this.supplyService.getTotalSupplyForLastDay(address);
  }
}
