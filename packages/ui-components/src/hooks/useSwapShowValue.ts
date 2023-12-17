import { useEffect } from 'react'
import useSwapBuildParameter from './useSwapBuildParameter'
import { useAppStore } from '../state'
import { BigNumber, ethers } from 'ethers'
import { ThousandageValue } from '../utils'

type SwapShowValue = ReturnType<typeof useSwapBuildParameter>

export default function useSwapShowValue({
  isSameChain,
  isFromNeedSwap,
  isToNeedSwap,
  sellArgs,
  buyArgs,
  error,
  quoteDataSell,
  quoteDataBuy,
  quotebuyAmount,
  input
}: SwapShowValue) {
  // const setFee = useAppStore(state => state.setFee)
  const setSrcGrossPrice = useAppStore(state => state.setSrcGrossPrice)
  const setDestGrossPrice = useAppStore(state => state.setDestGrossPrice)

  const setDestEstimatedReceived = useAppStore(state => state.setDestEstimatedReceived)
  const setDestMinimumReceived = useAppStore(state => state.setDestMinimumReceived)
  const setQuoteLoading = useAppStore(state => state.setQuoteLoading)
  const setWillReceiveToken = useAppStore(state => state.setWillReceiveToken)

  useEffect(() => {
    setSrcGrossPrice('0')
    if (isFromNeedSwap) {
      if (quoteDataSell.data == undefined) {
        return
      }
      setSrcGrossPrice(quoteDataSell.data.grossPrice)
    }
  }, [isFromNeedSwap, quoteDataSell.data, setSrcGrossPrice])

  useEffect(() => {
    if (quoteDataSell.isloading || quoteDataBuy.isloading) {
      setQuoteLoading(true)
    } else if (quoteDataSell.isloading == false && quoteDataBuy.isloading == false) {
      setQuoteLoading(false)
    }
  }, [quoteDataSell, quoteDataBuy, setQuoteLoading])

  useEffect(() => {
    setDestEstimatedReceived('0')
    setDestMinimumReceived('0')

    let guaranteedBuyAmount
    if (isSameChain) {
      if (isFromNeedSwap) {
        if (quoteDataSell.data && quoteDataSell.data.grossBuyAmount !== undefined) {
          guaranteedBuyAmount = ThousandageValue(BigNumber.from(quoteDataSell.data.grossBuyAmount), 1).toString()
          setDestEstimatedReceived(quoteDataSell.data.grossBuyAmount)
          setDestMinimumReceived(guaranteedBuyAmount.toString())
          setDestGrossPrice(quoteDataSell.data.grossPrice)
        }
      }
    } else {
      if (isToNeedSwap) {
        if (quoteDataBuy?.data) {
          guaranteedBuyAmount = ThousandageValue(BigNumber.from(quoteDataBuy.data?.grossBuyAmount), 20).toString()
          setDestEstimatedReceived(quoteDataBuy?.data?.grossBuyAmount)
          setDestMinimumReceived(guaranteedBuyAmount.toString())
          const num1 = ethers.utils.parseEther('1000') //1*1000
          const num2 = ethers.utils.parseEther(quoteDataBuy.data.grossPrice)

          setDestGrossPrice((num1.div(num2).toNumber() / 1000).toString())
        }
      } else if (isFromNeedSwap) {
        if (quoteDataSell.data) {
          guaranteedBuyAmount = ThousandageValue(BigNumber.from(quoteDataSell.data.grossBuyAmount), 1).toString()
          setDestEstimatedReceived(quoteDataSell.data.grossBuyAmount)
          setDestMinimumReceived(guaranteedBuyAmount.toString())
          setDestGrossPrice(quoteDataSell.data.grossPrice)
        }
      } else {
        setDestEstimatedReceived(input)
        setDestMinimumReceived(input)
        setDestGrossPrice('1')
      }
    }

    // guaranteedBuyAmount=guaranteedBuyAmount||'0'
  }, [
    setDestGrossPrice,
    setDestEstimatedReceived,
    setDestMinimumReceived,
    isToNeedSwap,
    quoteDataBuy,
    quotebuyAmount,
    input,
    isFromNeedSwap,
    isSameChain,
    quoteDataSell
  ])

  useEffect(() => {
    if (isSameChain) {
      if (isFromNeedSwap) {
        if (quoteDataSell.data?.grossBuyAmount == undefined) return
        setWillReceiveToken(quoteDataSell.data?.grossBuyAmount)
      }
    } else {
      if (isToNeedSwap) {
        if (quoteDataBuy.data?.grossBuyAmount == undefined) return
        setWillReceiveToken(quoteDataBuy.data?.grossBuyAmount)
      } else if (isFromNeedSwap) {
        if (quoteDataSell.data?.grossBuyAmount == undefined) return
        setWillReceiveToken(quoteDataSell.data?.grossBuyAmount)
      } else {
        //usdc->usdc
        setWillReceiveToken(input)
      }
    }
  }, [setWillReceiveToken, isToNeedSwap, isFromNeedSwap, quoteDataBuy.data, quoteDataSell.data, input, isSameChain])
}
