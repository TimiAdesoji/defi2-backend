import { Injectable } from '@nestjs/common';
import { SortOrder } from 'dynamoose/dist/General';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Chart, ChartKey } from './chart.interface';

@Injectable()
export class ChartService {
  constructor(
    @InjectModel('chart')
    private chartModel: Model<Chart, ChartKey>,
  ) {}

  create(chart: Chart) {
    return this.chartModel.create(chart);
  }

  batchPut(chart: Chart[]) {
    return this.chartModel.batchPut(chart);
  }

  update(key: ChartKey, chart: Partial<Chart>) {
    return this.chartModel.update(key, chart);
  }

  findOne(key: ChartKey) {
    return this.chartModel.get(key);
  }

  findMany(address: string, ge: number) {
    return this.chartModel
      .query('address')
      .eq(address)
      .sort(SortOrder.ascending)
      .attributes(['timestamp', 'totalSupply'])
      .where('timestamp')
      .ge(ge)
      .exec();
  }

  findAll() {
    return this.chartModel.scan().exec();
  }
}
