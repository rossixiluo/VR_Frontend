import { Token } from '../types/token'
import { getChainInfo } from '../constants/chainInfo'
import { SupportedChainId, GAS_IS_ETH } from '../constants/chains'
import ethlogo from '../assets/icon/ethereum-logo.png'

export default function useDefaultToken(ChainID: SupportedChainId | null) {
  if (ChainID == null) {
    return
  }
  const chainInfo = getChainInfo(ChainID)
  const item: Token = {
    chainId: ChainID,
    address: '',
    name: chainInfo.nativeCurrency.name,
    symbol: chainInfo.nativeCurrency.symbol,
    decimals: chainInfo.nativeCurrency.decimals,
    logoURI: GAS_IS_ETH.includes(ChainID) ? ethlogo : chainInfo.logoUrl
  }
  return item
}
