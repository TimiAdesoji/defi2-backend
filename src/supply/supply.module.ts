import { Module } from '@nestjs/common';

import { ChartModule } from 'src/chart/chart.module';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';

@Module({
  imports: [ChartModule],
  providers: [SupplyService],
  controllers: [SupplyController],
})
export class SupplyModule {}
