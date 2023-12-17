import useSWR from 'swr'

import { BaseUrl } from '../constants/relayer'

import api from '../api/fetch'
import { SearchTxhash } from '../types/searchTxhash'
import { useStaticJsonRpc } from './useStaticJsonRpc'
import { useCallback } from 'react'

async function fetcher(txhash: string | undefined | null): Promise<SearchTxhash | undefined> {
  if (txhash == null || txhash == undefined) {
    return
  }

  const res = await api.get<SearchTxhash>(BaseUrl + '/search/?txhash=' + txhash)
  if (res && res.code == 0 && res.data) {
    return res
  } else {
    throw new Error('get Accounts info error ')
  }
}

export default function useTxStatus(txhash: string | undefined | null, isLocalSwap: boolean, isFromChainId: number | null) {
  const StaticJsonRpcProvider = useStaticJsonRpc(isFromChainId)
  const { data, error, isLoading } = useSWR(txhash && isLocalSwap == false ? ['/smw/txhash', txhash] : null, () => fetcher(txhash), {
    refreshInterval: 1000 * 15
  })

  const getTxStatus = useCallback(async () => {
    if (isLocalSwap == false || txhash == undefined || txhash == null || StaticJsonRpcProvider == undefined) return
    const result = await StaticJsonRpcProvider.getTransactionReceipt(txhash)

    return result?.status
  }, [StaticJsonRpcProvider, txhash, isLocalSwap])

  const {
    data: dataLocal,
    error: errorLocaL,
    isLoading: isLoadingLocaL
  } = useSWR(txhash && isLocalSwap == true ? ['/smw/txhash_local', txhash] : null, getTxStatus, {
    refreshInterval: 1000 * 15
  })

  return {
    data: data,
    error,
    isLoading,
    dataLocal,
    errorLocaL,
    isLoadingLocaL,
    isLocalSwap
  }
}
