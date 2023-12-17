export interface Token {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  balance?: string
}

export interface Version {
  major: number
  minor: number
  patch: number
}

export interface RootTokenList {
  name: string
  logoURI: string
  keywords: string[]
  timestamp: string
  tokens: Token[]
  version: Version
}
