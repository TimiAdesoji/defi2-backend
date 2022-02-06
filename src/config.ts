export const application = {
  infuraRpcUrl:
    process.env.INFURA_RPC_URL ||
    'https://mainnet.infura.io/v3/8d810610fe7741cc9753cbaafb1f000c',
  theGraphApiBaseUrl:
    process.env.THE_GRAPH_API_BASE_URL ||
    'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2',
  contractAddress: {
    eth:
      process.env.ETH_SMART_CONTRACT_ADDRESS ||
      '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
    dai:
      process.env.DAI_SMART_CONTRACT_ADDRESS ||
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  },
};

export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'minter',
        type: 'address',
      },
      {
        indexed: false,
        name: 'mintAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'mintTokens',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
    signature:
      '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'redeemer',
        type: 'address',
      },
      {
        indexed: false,
        name: 'redeemAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'redeemTokens',
        type: 'uint256',
      },
    ],
    name: 'Redeem',
    type: 'event',
    signature:
      '0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929',
  },
];
