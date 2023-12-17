import { useWeb3React } from '@web3-react/core'
import { LeaveTime_Chainid } from '../constants/relayer'
import { SupportedChainId } from '../constants/chains'

export default function useAverageTime(chainId_?: SupportedChainId | null): string | undefined {
  const { chainId } = useWeb3React()
  const id = chainId_ || chainId
  if (id == undefined) {
    return
  }
  return LeaveTime_Chainid[id as SupportedChainId]
}
