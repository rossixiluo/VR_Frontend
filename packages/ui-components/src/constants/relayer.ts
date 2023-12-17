import { SupportedChainId } from './chains'

export const Relayer_IDS_TO_ADDR = {
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.AVALANCHE_FUJITEST]: '',
  [SupportedChainId.AVALANCHE_C_HAIN]: '0xEAA6EF960cb70e51B6242cD0aC731EFc454CdC6A',
  [SupportedChainId.MAINNET]: '0xe843D974748b87c17F507e93F03F442A9E85e778',
  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.ARBITRUM_ONE]: '0xEAA6EF960cb70e51B6242cD0aC731EFc454CdC6A',
  [SupportedChainId.ARBITRUM_Goerli]: '',
  [SupportedChainId.OPTIMISM]: '0x650Af55D5877F289837c30b94af91538a7504b76',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

export const Circle_Chainid = {
  [SupportedChainId.GOERLI]: 0,
  [SupportedChainId.AVALANCHE_FUJITEST]: 1,
  [SupportedChainId.AVALANCHE_C_HAIN]: 1,
  [SupportedChainId.MAINNET]: 0,
  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.ARBITRUM_ONE]: 3,
  [SupportedChainId.ARBITRUM_Goerli]: 3,
  [SupportedChainId.OPTIMISM]: '2',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}
//Time needed to leave
export const LeaveTime_Chainid = {
  [SupportedChainId.GOERLI]: '1 minutes',
  [SupportedChainId.MAINNET]: '13 minutes',

  [SupportedChainId.AVALANCHE_FUJITEST]: '1 minutes',
  [SupportedChainId.AVALANCHE_C_HAIN]: '3 minutes',

  [SupportedChainId.ARBITRUM_Goerli]: '1 minutes',
  [SupportedChainId.ARBITRUM_ONE]: '13 minutes',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '3 minutes',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

//TokenList
export const TokenList_Chainid = {
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.MAINNET]: 'https://tokens.coingecko.com/ethereum/all.json',

  [SupportedChainId.AVALANCHE_FUJITEST]: '',
  [SupportedChainId.AVALANCHE_C_HAIN]: 'https://tokens.coingecko.com/avalanche/all.json',

  [SupportedChainId.ARBITRUM_Goerli]: '',
  [SupportedChainId.ARBITRUM_ONE]: 'https://tokens.coingecko.com/arbitrum-one/all.json',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

//TokenList
export const TokenList_Balance = {
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.MAINNET]: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',

  [SupportedChainId.AVALANCHE_FUJITEST]: '',
  [SupportedChainId.AVALANCHE_C_HAIN]: '0xD023D153a0DFa485130ECFdE2FAA7e612EF94818',

  [SupportedChainId.ARBITRUM_Goerli]: '',
  [SupportedChainId.ARBITRUM_ONE]: '0x151E24A486D7258dd7C33Fb67E4bB01919B7B32c',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

export const BaseUrl = 'https://apiproxy.valuerouter.com/api'

export const BaseQuote = 'https://apiproxy.valuerouter.com/api/quote'

//https://express-hello-world-gamma.vercel.app/api/quote?buyToken=DAI&sellToken=ETH&sellAmount=100000&chainid=1

export const uniswapTokenList = '/tokens.json'
