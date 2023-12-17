import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useAppStore } from '../../state'
import { cutOut, formatUnitsErc20 } from '../../utils'
import useRelayCall from '../../hooks/useRelayCall'
import { Else, If, Then, When } from 'react-if'

import useAverageTime from '../../hooks/useAverageTime'
import SetepLoading from './StepperLoading'

import TokenAndChainInfo from './TokenAndChainInfo'
import useCusRecipientAddress from '../../hooks/useCusRecipientAddress'
import { useWeb3React } from '@web3-react/core'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
// import EventEmitter from '../../EventEmitter/index'
import Loading from '../loading'
import useUSDCAddress from '../../hooks/useUsdc'
import { getChainInfo } from '../../constants/chainInfo'

interface componentprops {
  isOpen: boolean
  closeModal: () => void
}

const PreviewModal: FC<componentprops> = ({ isOpen, closeModal }) => {
  // const fromChainInfo = useAppStore(state => state.fromChain)

  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)

  const fee = useAppStore(state => state.fee)
  // const fee = useAppStore(state => state.fee)
  const RelayCall = useRelayCall()
  const [txHash, setTxHash] = useState<string | null>(null)
  const isLocalSwap = useMemo(() => {
    return toChainID == fromChainID
  }, [toChainID, fromChainID])

  // const status = useTxStatus(txHash, isLocalSwap, fromChainID)

  const [isTxLoading, setIsTxLoading] = useState(false)
  const AverageTime = useAverageTime(fromChainID)

  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  const srcGrossPrice = useAppStore(state => state.srcGrossPrice)
  const destGrossPrice = useAppStore(state => state.destGrossPrice)
  const destEstimatedReceived = useAppStore(state => state.destEstimatedReceived)
  const destMinimumReceived = useAppStore(state => state.destMinimumReceived)

  const [toTxHash, setToTxHash] = useState<string | null>(null)
  // const setInput = useAppStore(state => state.setInput)
  const [txStatus, settxStatus] = useState<number | undefined>(undefined)
  // const toToken = useAppStore(state => state.willReceiveToken)
  const CusRecipientAddress = useCusRecipientAddress()
  const { account, chainId } = useWeb3React()
  const usdcTo = useUSDCAddress(toChainID)
  const usdcFrom = useUSDCAddress(fromChainID)

  const clickref = useRef<boolean>(false)

  const isToNeedSwap = useMemo(() => {
    if (toToken?.address != usdcTo && fromChainID !== toChainID) {
      return true
    } else {
      return false
    }
  }, [toToken, usdcTo, fromChainID, toChainID])

  const isFromNeedSwap = useMemo(() => {
    if (fromToken?.address.toLowerCase() != usdcFrom?.toLowerCase()) {
      return true
    } else {
      return false
    }
  }, [fromToken, usdcFrom])

  const SubmitFN = useCallback(async () => {
    if (clickref.current == true) return
    clickref.current = true
    setIsTxLoading(true)
    try {
      const TX = await RelayCall.doSwapFetch()
      if (TX) {
        setTxHash(TX.hash)
        const txData = await TX.wait()
        settxStatus(txData.status)
      }

      //eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      setTxHash(null)
    }
    setIsTxLoading(false)
    clickref.current = false
  }, [RelayCall, setTxHash, setIsTxLoading, settxStatus])

  // useEffect(()=>{
  //  if(statusMint.step==3){
  //   setIsTxLoading(false)
  //  }
  // },[statusMint,closeModal])

  const closeModalFn = useCallback(() => {
    setTxHash(null)
    closeModal()
    settxStatus(undefined)
    setToTxHash(null)
    setIsTxLoading(false)
    clickref.current = false
    // EventEmitter.emit('Refresh')
    // setInput('0')
  }, [closeModal, setTxHash, settxStatus, setToTxHash, setIsTxLoading])

  useEffect(() => {
    closeModalFn()
  }, [chainId, closeModalFn, account])

  const RecipientAddress = useMemo(() => {
    return CusRecipientAddress || account
  }, [CusRecipientAddress, account])

  const ChainGasCoin = useMemo(() => {
    return getChainInfo(chainId)?.nativeCurrency
  }, [chainId])
  if (fromToken == null || toToken == null) {
    return <></>
  }

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalFn}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Preview
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="w-full  lg:py-6 mb-6 lg:mb-0 text-sm">
                      <div className=" flex  justify-around mb-2 items-center">
                        <TokenAndChainInfo isFrom={true} txhash={txHash}></TokenAndChainInfo>
                        <div>
                          <ChevronDoubleRightIcon className=" w-4 h-4"></ChevronDoubleRightIcon>
                        </div>
                        <TokenAndChainInfo isFrom={false} txhash={toTxHash}></TokenAndChainInfo>
                      </div>

                      <When condition={fromChainID !== toChainID}>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Average time</span>
                          <span className="ml-auto text-gray-900">{AverageTime}</span>
                        </div>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Protocol fees</span>
                          <span className="ml-auto text-gray-900">
                            {fee && ChainGasCoin && formatUnitsErc20(fee, ChainGasCoin.symbol, ChainGasCoin.decimals)}
                          </span>
                        </div>
                      </When>

                      <div className="flex border-t border-gray-200 py-1">
                        <span className="text-gray-500">Recipient Address</span>
                        <span className="ml-auto text-gray-900">{RecipientAddress && cutOut(RecipientAddress, 6, 6)}</span>
                      </div>
                      <When condition={isFromNeedSwap}>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Exchange Rate(Src) </span>
                          <span className="ml-auto text-gray-900">
                            {srcGrossPrice} {fromToken.symbol}/{toChainID == fromChainID ? toToken.symbol : 'usdc'}
                          </span>
                        </div>
                      </When>

                      <When condition={fromChainID !== toChainID && isToNeedSwap}>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Exchange Rate(Dest) </span>
                          <span className="ml-auto text-gray-900">
                            {destGrossPrice} {toToken.symbol}/usdc
                          </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Estimated received </span>
                          <span className="ml-auto text-gray-900">{formatUnitsErc20(destEstimatedReceived, toToken.symbol, toToken.decimals)} </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-1">
                          <span className="text-gray-500">Minimum received </span>
                          <span className="ml-auto text-gray-900">{formatUnitsErc20(destMinimumReceived, toToken.symbol, toToken.decimals)}</span>
                        </div>
                      </When>

                      {/* <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                        <span className="text-gray-500">Protocol Fee</span>
                        <span className="ml-auto text-gray-900">
                          {formatUnitsErc20(fee, fromChainInfo?.nativeCurrency.symbol || '', fromChainInfo?.nativeCurrency.decimals || 18)}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col">
                    <If condition={isTxLoading == false && txHash == null}>
                      <Then>
                        <button
                          type="button"
                          className="px-6 py-3.5 inline-flex flex-1 justify-center rounded-md border border-transparent bg-blue-700  text-sm font-medium  text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={SubmitFN}
                        >
                          Swap
                        </button>
                      </Then>
                      <Else>
                        <If condition={isLocalSwap}>
                          <Then>
                            <If condition={isTxLoading}>
                              <Then>
                                <button className="px-6 py-3.5 text-white flex-1 flex  flex-row   bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait">
                                  <Loading></Loading>
                                  <div className=" flex-1 text-center">Send Tx loading</div>
                                </button>
                              </Then>
                              <Else>
                                {txStatus == 1 ? (
                                  <div
                                    className="p-4 mb-4 text-sm  text-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                                    role="alert"
                                  >
                                    <span className="font-medium">Success</span>.
                                  </div>
                                ) : (
                                  <div
                                    className="p-4 mb-4 text-sm  text-center text-red-400 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-green-400"
                                    role="alert"
                                  >
                                    <span className="font-medium">Error</span>.
                                  </div>
                                )}
                              </Else>
                            </If>
                          </Then>
                          <Else>
                            <SetepLoading
                              txhash={txHash}
                              isLocalSwap={isLocalSwap}
                              fromChainID={fromChainID}
                              setTxBack={hash => {
                                setToTxHash(hash)
                              }}
                            ></SetepLoading>
                          </Else>
                        </If>
                      </Else>
                    </If>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default PreviewModal
