import { useWeb3React } from '@web3-react/core'

import { useAppStore } from '../state'

import useSWR from 'swr/immutable'
import { BaseQuote } from '../constants/relayer'
import { NativeCoinAddress } from '../constants/usdc'
import api from '../api/fetch'
import { Quote } from '../types/quote'
import useUSDCAddress from './useUsdc'
import { isEqual } from 'lodash-es'

export default function useQuote(isneedSwap: boolean, isFrom: boolean, sellAmount?: string) {
  const { account } = useWeb3React()

  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)
  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  const error_ = useAppStore(state => state.error)

  const inputAmount = useAppStore(state => state.input)
  const ChainID = isFrom ? fromChainID : toChainID
  const amount = isFrom ? inputAmount : sellAmount

  const usdcAddress = useUSDCAddress(ChainID)

  const isSwap = fromToken !== null && isneedSwap && toToken !== null && !isEqual(fromToken, toToken) && error_ == '' && inputAmount !== '0'
  const tokenAddress = isFrom ? fromToken?.address : toToken?.address

  const { data, error, isLoading } = useSWR(
    isSwap ? ['BaseQuote', account, ChainID, tokenAddress, amount, usdcAddress, isFrom, toToken?.address] : null,
    async ([key, account, ChainID, tokenAddress, inputAmount, usdcAddress, isFrom, toTokenaddress]) => {
      if (account && fromChainID !== null && tokenAddress !== undefined && inputAmount !== undefined) {
        const buyToken = isFrom
          ? fromChainID !== toChainID
            ? usdcAddress
            : toTokenaddress == ''
            ? NativeCoinAddress
            : toTokenaddress
          : tokenAddress == ''
          ? NativeCoinAddress
          : tokenAddress

        const sellToken = isFrom ? (tokenAddress == '' ? NativeCoinAddress : tokenAddress) : usdcAddress

        const sellAmount = inputAmount
        const chainid = ChainID

        const url = `${BaseQuote}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&chainid=${chainid}`
        const data = await api.get<Quote>(url)
        if (data.code == undefined) {
          return data
        } else {
          if (data.validationErrors && data.validationErrors.length > 0) {
            throw new Error(data.validationErrors[0].description)
          } else {
            throw new Error(data.reason)
          }
        }
      }
    }
  )

  return {
    data: data,
    isloading: isLoading,
    error
  }
}
