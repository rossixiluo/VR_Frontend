import useUSDCAddress from './useUsdc'
import { useAppStore } from '../state'
import { useMemo } from 'react'
import { NativeCoinAddress } from '../constants/usdc'
import useQuote from './useQuote'
import { BigNumber, ethers } from 'ethers'
import useRelayerFee from './useRelayerFee'
import { IncreasingPercentageValue, ThousandageValue } from '../utils'

export default function useSwapBuildParameter() {
  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)

  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  const input = useAppStore(state => state.input)
  // const setWillReceiveToken = useAppStore(state => state.setWillReceiveToken)
  // const setQuoteLoading = useAppStore(state => state.setQuoteLoading)
  const { fee: dataFee } = useRelayerFee()
  // const setFee = useAppStore(state => state.setFee)
  // const setSrcGrossPrice = useAppStore(state => state.setSrcGrossPrice)
  // const setDestGrossPrice = useAppStore(state => state.setDestGrossPrice)

  // const setDestEstimatedReceived = useAppStore(state => state.setDestEstimatedReceived)
  // const setDestMinimumReceived = useAppStore(state => state.setDestMinimumReceived)

  const usdcFrom = useUSDCAddress(fromChainID)
  const usdcTo = useUSDCAddress(toChainID)

  const isFromNeedSwap = useMemo(() => {
    if (fromChainID !== toChainID && fromToken?.address.toLowerCase() == usdcFrom?.toLowerCase()) {
      return false
    } else {
      return true
    }
  }, [fromToken, usdcFrom, fromChainID, toChainID])

  const quoteDataSell = useQuote(isFromNeedSwap, true)

  const isToNeedSwap = useMemo(() => {
    if (toToken?.address.toLowerCase() != usdcTo?.toLowerCase() && fromChainID !== toChainID) {
      return true
    } else {
      return false
    }
  }, [toToken, usdcTo, fromChainID, toChainID])

  const slippageGrossBuyAmount = useMemo(() => {
    let fromNum: string | undefined

    if (isFromNeedSwap) {
      if (quoteDataSell.data == undefined) {
        return
      }
      fromNum = quoteDataSell.data?.grossBuyAmount || quoteDataSell.data?.buyAmount
      // console.log('fromNum', fromNum)
      fromNum = ThousandageValue(BigNumber.from(fromNum), 5).toString()
      // console.log('fromNum', fromNum)
      //Reduced values provide success rates
    } else {
      fromNum = input
    }
    return fromNum
  }, [isFromNeedSwap, input, quoteDataSell.data])

  const quotebuyAmount = useMemo(() => {
    // if (dataFee !== undefined) {
    //   setFee(dataFee.toString())
    // } else {
    //   setFee('0')
    // }

    if (slippageGrossBuyAmount == undefined) {
      return
    }

    return slippageGrossBuyAmount
  }, [slippageGrossBuyAmount])

  const quoteDataBuy = useQuote(isToNeedSwap, false, quotebuyAmount)

  /*
        struct SellArgs {
        address sellToken;
        uint256 sellAmount;
        uint256 sellcallgas;
        bytes sellcalldata;
    }

    struct BuyArgs {
        bytes32 buyToken;
        uint256 guaranteedBuyAmount;
        uint256 buycallgas;
        bytes buycalldata;
    }
    */

  const sellArgs = useMemo(() => {
    if (fromToken == null || input == '0') return null
    if (isFromNeedSwap == true && quoteDataSell.data == undefined && slippageGrossBuyAmount == undefined) {
      return null
    }
    const sellToken = isFromNeedSwap ? (fromToken.address == '' ? NativeCoinAddress : fromToken.address) : usdcFrom
    const sellAmount = input
    const sellcallgas = isFromNeedSwap ? quoteDataSell.data?.gas : '0'
    const sellcalldata = isFromNeedSwap ? quoteDataSell.data?.data : '0x0000000000000000000000000000000000000000000000000000000000000000'

    const guaranteedBuyAmount = isFromNeedSwap ? slippageGrossBuyAmount : '0'

    return {
      sellToken,
      sellAmount,
      sellcallgas: IncreasingPercentageValue(sellcallgas, 100),
      sellcalldata,
      guaranteedBuyAmount,
      buyToken:
        fromChainID !== toChainID && usdcFrom?.toLowerCase() == quoteDataSell.data?.buyTokenAddress
          ? '0x0000000000000000000000000000000000000000'
          : quoteDataSell.data?.buyTokenAddress
    }
  }, [isFromNeedSwap, fromToken, input, quoteDataSell.data, usdcFrom, slippageGrossBuyAmount, fromChainID, toChainID])

  const buyArgs = useMemo(() => {
    if (toToken == null) return null
    if (isToNeedSwap && quoteDataBuy.data == undefined) return null

    const buyToken = isToNeedSwap ? (toToken.address == '' ? NativeCoinAddress : toToken.address) : usdcTo
    if (buyToken == undefined) {
      return null
    }
    const guaranteedBuyAmount = isToNeedSwap ? ThousandageValue(BigNumber.from(quoteDataBuy.data?.grossBuyAmount), 5) : quotebuyAmount || '0'

    // const buycallgas = isToNeedSwap ? quoteDataBuy.data?.gas : '0'
    // const buycalldata = isToNeedSwap ? quoteDataBuy.data?.data : '0x0000000000000000000000000000000000000000000000000000000000000000'
    const tokenAddress = usdcTo?.toLowerCase() == buyToken.toLowerCase() ? '0x0000000000000000000000000000000000000000' : buyToken
    const buyTokenAddresds = ethers.utils.hexZeroPad(tokenAddress, 32)
    return {
      buyToken: buyTokenAddresds,
      guaranteedBuyAmount
      // buycallgas: IncreasingPercentageValue(buycallgas, 100),
      // buycalldata
    }
  }, [isToNeedSwap, toToken, quoteDataBuy.data, quotebuyAmount, usdcTo])

  return {
    isFromNeedSwap,
    isToNeedSwap,
    isSameChain: fromChainID == toChainID,
    sellArgs,
    buyArgs,
    error: quoteDataSell.error || quoteDataBuy.error,
    quoteDataSell,
    quoteDataBuy,
    quotebuyAmount,
    input,
    relayerFee: dataFee
  }
}
