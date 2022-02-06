export const normalizeTimeStamp = (time: number): number => {
  const currentTimestamp = time * 1000;
  const currentHour = new Date(currentTimestamp).getHours();
  const normalizedTimestamp = new Date(currentTimestamp).setHours(
    currentHour,
    0,
    0,
    0,
  );
  return normalizedTimestamp;
};

export const generateUniqueId = (
  address: string,
  timestamp: number,
): string => {
  return `${address}-${timestamp}`;
};

export const getMintEventsQuery = (
  blockTime_gte: number,
  blockTime_lte: number,
) => `
  query {
    mintEvents(where: {cTokenSymbol_in:["cDAI","cETH"],blockTime_gte: ${blockTime_gte},blockTime_lte: ${blockTime_lte}}) {
      id
      amount
      to
      from
      blockNumber
      blockTime
      cTokenSymbol
      underlyingAmount
    }
  }`;

export const getRedeemEventsQuery = (
  blockTime_gte: number,
  blockTime_lte: number,
) => `
  query {
    redeemEvents(where: {cTokenSymbol_in:["cDAI","cETH"],blockTime_gte: ${blockTime_gte},blockTime_lte: ${blockTime_lte}}) {
      id
      amount
      to
      from
      blockNumber
      blockTime
      cTokenSymbol
      underlyingAmount
    }
  }`;
