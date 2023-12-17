// import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { uniswapTokenList } from '../constants/relayer'
import api from '../api/fetch'

import { RootTokenList } from '../types/token'

import { useMemo } from 'react'

import { useAppStore } from '../state/index'

export default function useTokenList(dataType: boolean) {
  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)
  const chainid = dataType ? fromChainID : toChainID

  const { data, error, isLoading } = useSWRImmutable('tokenList', async () => {
    // const tokenUrl = TokenList_Chainid[chainid]
    const tokenUrl = uniswapTokenList
    const res = await api.get<RootTokenList>(tokenUrl)
    return res.tokens
  })
  const tokenList = useMemo(() => {
    return data?.filter(item => item.chainId == chainid)
  }, [chainid, data])

  return {
    data: tokenList,
    error,
    isLoading
    // balanceList,
    // balanceError,
    // balanceisLoading
  }
}
