export interface Events {
  id: string;
  amount: string;
  to: string;
  from: string;
  blockNumber: number;
  blockTime: number;
  cTokenSymbol: string;
  underlyingAmount: string;
}

export interface GroupedEvent {
  id: string;
  timestamp: number;
  totalSupply: number;
  address: string;
}

export interface GroupedEvents {
  [key: string]: Record<number, GroupedEvent>;
}

export enum EventName {
  Mint = 'mint',
  Redeem = 'redeem',
}
