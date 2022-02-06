import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import fetch from 'cross-fetch';
import * as Config from '../config';
import { ethers, Contract } from 'ethers';
import { subHours, toDate } from 'date-fns';
import { ChartService } from '../chart/chart.service';
import {
  generateUniqueId,
  normalizeTimeStamp,
  getMintEventsQuery,
  getRedeemEventsQuery,
} from '../utils/helpers';
import { GroupedEvents, Events, EventName } from './collector.interface';

@Injectable()
export class CollectorService implements OnModuleInit {
  private readonly logger = new Logger(CollectorService.name);
  clientMetadata: ApolloClient<NormalizedCacheObject>;
  provider: ethers.providers.JsonRpcProvider;
  private ethContract: Contract;
  private daiContract: Contract;
  private groupedEvents: GroupedEvents;

  constructor(private readonly chartService: ChartService) {
    this.clientMetadata = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: Config.application.theGraphApiBaseUrl,
        fetch,
      }),
    });

    this.provider = new ethers.providers.JsonRpcProvider(
      Config.application.infuraRpcUrl,
    );
    this.ethContract = new ethers.Contract(
      Config.application.contractAddress.eth,
      Config.abi,
      this.provider,
    );
    this.daiContract = new ethers.Contract(
      Config.application.contractAddress.dai,
      Config.abi,
      this.provider,
    );
  }

  onModuleInit() {
    // start events listers
    this.listenToEvents();

    // fetch data from compound's the graph
    this.fetchFromTheGraph();
  }

  async listenToEvents() {
    this.ethContract.on('Mint', (address, amount, token) => {
      this.logger.log(
        `{Address => ${address}, Amount => ${amount}, Tokens => ${token}}`,
        'ETH[Mint] => ',
      );
    });
    this.ethContract.on('Redeem', (address, amount, token) => {
      this.logger.log(
        `{Address => ${address}, Amount => ${amount}, Tokens => ${token}}`,
        'ETH[Redeem] => ',
      );
    });
    this.daiContract.on('Mint', (address, amount, token) => {
      this.logger.log(
        `{Address => ${address}, Amount => ${amount}, Tokens => ${token}}`,
        'DAI[Mint] => ',
      );
    });
    this.daiContract.on('Redeem', (address, amount, token) => {
      this.logger.log(
        `{Address => ${address}, Amount => ${amount}, Tokens => ${token}}`,
        'DAI[Redeem] => ',
      );
    });
  }

  private groupEvents(eventName: EventName, events: Events[]): any {
    events?.forEach(({ blockTime, amount, from, to }) => {
      const timestamp = normalizeTimeStamp(blockTime);
      const address = eventName === EventName.Redeem ? to : from;
      const id = generateUniqueId(address, timestamp);
      const totalSupply =
        Number(amount) +
        Number(this.groupedEvents[address]?.[timestamp]?.totalSupply || 0);

      (this.groupedEvents[address] || {})[timestamp] = {
        id,
        timestamp,
        totalSupply,
        address,
      };
    });
  }

  async fetchFromTheGraph() {
    try {
      const now = new Date();
      const yesterday = subHours(now, 24);

      const startTime = Math.round(yesterday.getTime() / 1000);
      const endTime = Math.round(toDate(now).getTime() / 1000);

      const [mintEvents, redeemEvents] = await Promise.all([
        this.clientMetadata.query({
          query: gql(getMintEventsQuery(startTime, endTime)),
        }),
        this.clientMetadata.query({
          query: gql(getRedeemEventsQuery(startTime, endTime)),
        }),
      ]);

      this.groupedEvents = {};

      this.groupEvents(EventName.Mint, mintEvents?.data?.mintEvents);
      this.groupEvents(EventName.Redeem, redeemEvents?.data?.redeemEvents);

      const formattedEvents = [];
      Object.keys(this.groupedEvents).forEach((event) =>
        formattedEvents.push(...Object.values(this.groupedEvents[event])),
      );

      formattedEvents.forEach((event) => this.chartService.create(event));
    } catch (err) {
      this.logger.error('collector.service.fetchFromTheGraph', err);
    }
  }
}
