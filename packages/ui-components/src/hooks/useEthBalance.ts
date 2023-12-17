import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useAppStore } from '../state'

import useSWR from 'swr'
import { useStaticJsonRpc } from './useStaticJsonRpc'

export default function useEthBalance() {
  const { account } = useWeb3React()
  const fromChainID = useAppStore(state => state.fromChainID)

  //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))

  const StaticJsonRpcProvider = useStaticJsonRpc(fromChainID)

  const fetchData = useCallback(async () => {
    if (account && StaticJsonRpcProvider !== undefined) {
      const result: BigNumber = await StaticJsonRpcProvider.getBalance(account)

      return result.toString()
    } else {
      return '0'
    }
  }, [StaticJsonRpcProvider, account])

  const { data, error, isLoading } = useSWR(['EthBalance', account, fromChainID], fetchData, { refreshInterval: 10 * 1000 })

  return {
    balance: data,
    isloading: isLoading,
    error
  }
}
