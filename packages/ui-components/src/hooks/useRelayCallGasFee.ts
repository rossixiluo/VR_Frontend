import { useWeb3React } from '@web3-react/core'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { BigNumber, Contract, ethers } from 'ethers'
import type { ContractTransaction } from 'ethers'
import { useDebounce } from 'react-use'
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'

import { Circle_Chainid } from '../constants/relayer'
import { useAppStore } from '../state'

import useErcCheckAllowance from './useCheckAllowance'

import useSwapBuildParameter from './useSwapBuildParameter'
import useCusRecipientAddress from './useCusRecipientAddress'
import useSwapShowValue from './useSwapShowValue'

export default function useRelayCallGasFee() {
  const { library, account, chainId } = useWeb3React()

  const contractAddress = useRelayerAddress()

  const inputAmount = useAppStore(state => state.input)
  const toChainID = useAppStore(state => state.toChainID)
  const fromChainID = useAppStore(state => state.fromChainID)
  const setGasFeeStore = useAppStore(state => state.setGasFee)
  const setError = useAppStore(state => state.setError)
  const error = useAppStore(state => state.error)

  const { Validation2, allowanceValue, fetchAllowanceData } = useErcCheckAllowance()

  const fromToken = useAppStore(state => state.fromToken)
  const SwapParameter = useSwapBuildParameter()
  useSwapShowValue(SwapParameter)

  const [gasFeeLoading, setGasFeeLoading] = useState(false)
  const CusRecipientAddress = useCusRecipientAddress()

  const isAllowance = useMemo(() => {
    return Validation2(allowanceValue, inputAmount) || fromToken?.address == ''
  }, [Validation2, inputAmount, allowanceValue, fromToken])

  useEffect(() => {
    if (SwapParameter.error) {
      setError(SwapParameter.error?.message)
    }
  }, [SwapParameter.error, setError])

  const getgas = useCallback(
    async (isestimateGas: boolean) => {
      if (
        contractAddress == undefined ||
        toChainID == null ||
        isAllowance == false ||
        SwapParameter.sellArgs == null ||
        SwapParameter.buyArgs == null ||
        account == undefined ||
        account == null ||
        fromChainID == null ||
        fromChainID !== chainId ||
        (fromChainID !== toChainID && SwapParameter.relayerFee == undefined)
      ) {
        return
      }

      const signer = library.getSigner()
      const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
      const destDomain = Circle_Chainid[toChainID]
      /**
     *    function swapAndBridge(
        SellArgs calldata sellArgs,
        BuyArgs calldata buyArgs,
        uint32 destDomain,
        bytes32 recipient
    ) public payable returns (uint64, uint64)
    */
      const sellArgs = SwapParameter.sellArgs
      const buyArgs = SwapParameter.buyArgs
      const value = fromToken?.address == '' ? inputAmount : '0'
      const accountRecipient = CusRecipientAddress || account
      const accounthex32 = ethers.utils.hexZeroPad(accountRecipient, 32)

      const gasAndValue: { value?: string; gasLimit?: number } = {}
      if (value != '0') {
        gasAndValue.value = value
      }
      if (SwapParameter.relayerFee !== undefined && SwapParameter.isSameChain == false) {
        gasAndValue.value = BigNumber.from(gasAndValue.value || '0')
          .add(SwapParameter.relayerFee)
          .toString()
      }

      if (isestimateGas) {
        setGasFeeLoading(true)
        try {
          if (fromToken?.address !== '') {
            const AllowanceData = await fetchAllowanceData()
            const isApprove = Validation2(AllowanceData, inputAmount)
            if (isApprove == false) {
              setGasFeeLoading(true)
              console.info('need approve')
              return
            }
          }
          let result

          if (fromChainID !== toChainID) {
            result = await contract.estimateGas.swapAndBridge(sellArgs, buyArgs, destDomain, accounthex32, gasAndValue)
          } else {
            result = await contract.estimateGas.swap(
              sellArgs.sellcalldata,
              sellArgs.sellcallgas,
              sellArgs.sellToken,
              sellArgs.sellAmount,
              sellArgs.buyToken,
              sellArgs.guaranteedBuyAmount,
              accountRecipient,
              gasAndValue
            )
          }

          setGasFeeStore(result.toString())
        } catch (error: unknown) {
          setGasFeeLoading(false)
          //error.data.message

          const errorInfo = error as {
            reason: string
            message: string
            data: {
              message: string
            }
          }
          setError(errorInfo.data?.message || errorInfo.message.substring(0, 200) + '...' || errorInfo.reason || 'call swap failed')
          throw error as Error
        }
        setGasFeeLoading(false)
      } else {
        try {
          let result: ContractTransaction
          if (fromChainID !== toChainID) {
            result = await contract.swapAndBridge(sellArgs, buyArgs, destDomain, accounthex32, gasAndValue)
          } else {
            result = await contract.swap(
              sellArgs.sellcalldata,
              sellArgs.sellcallgas,
              sellArgs.sellToken,
              sellArgs.sellAmount,
              sellArgs.buyToken,
              sellArgs.guaranteedBuyAmount,
              accountRecipient,
              gasAndValue
            )
          }

          return result
        } catch (error: unknown) {
          throw error as Error
        }
      }
    },
    [
      library,
      contractAddress,
      setGasFeeStore,
      toChainID,
      account,
      SwapParameter.buyArgs,
      SwapParameter.sellArgs,
      setGasFeeLoading,
      isAllowance,
      inputAmount,
      fromToken?.address,
      CusRecipientAddress,
      setError,
      fetchAllowanceData,
      Validation2,
      fromChainID,
      chainId,
      SwapParameter.isSameChain,
      SwapParameter.relayerFee
    ]
  )

  useDebounce(
    () => {
      if (error == '') {
        getgas(true)
      }
    },
    100,
    [getgas, error]
  )

  const sendTx = useCallback(() => {
    return getgas(false)
  }, [getgas])

  return {
    gasFeeLoading: gasFeeLoading,
    sendTx
  }
}
