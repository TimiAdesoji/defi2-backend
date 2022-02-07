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

export const getMintEventsQuery = (startTime: number, endTime: number) => `
  query {
    mintEvents(where: {cTokenSymbol_in:["cDAI","cETH"],blockTime_gte: ${startTime},blockTime_lte: ${endTime}}) {
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

export const getRedeemEventsQuery = (startTime: number, endTime: number) => `
  query {
    redeemEvents(where: {cTokenSymbol_in:["cDAI","cETH"],blockTime_gte: ${startTime},blockTime_lte: ${endTime}}) {
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
