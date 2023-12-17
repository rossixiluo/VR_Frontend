import { createStore, useStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import React, { createContext, FC, useContext } from 'react'
import { L1ChainInfo, L2ChainInfo } from '../constants/chainInfo'
import { SupportedChainId } from '../constants/chains'
import { Token } from '../types/token'
import { Keplr, AccountData, OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types'
//SupportedChainId

export type serveStatus = {
  attest?: string
  mint?: string
  scan?: string
  swap?: string
}

export interface txItem {
  fromChainID: SupportedChainId
  toChainID: SupportedChainId
  input: string
  fee: string
  txhash: string
  status?: string | undefined
  creattime: number
  user: string
  fromToken: Token
  toToken: Token
  output: string
  toTxhash?: string
  serveStatus?: serveStatus
}

interface AppState {
  counter: number
  increase: (by: number) => void
  fromChain: L1ChainInfo | L2ChainInfo | null
  toChain: L1ChainInfo | L2ChainInfo | null
  fromChainID: SupportedChainId | null
  toChainID: SupportedChainId | null
  input: string
  output: string
  fee: string
  history: Array<txItem>
  gasFee: string
  fromToken: Token | null
  toToken: Token | null
  CustomRecipientAddress: string | null
  enableKeplr: boolean
  cosmosAddress: string | null
  setCosmosAddress: (address: string) => void
  getCosmosAddress: () => string | null
  setFromOrTOChain: (data: L1ChainInfo | L2ChainInfo, dataType: boolean, chainID: SupportedChainId) => void
  getFromChain: () => L1ChainInfo | L2ChainInfo | null
  getToChain: () => L1ChainInfo | L2ChainInfo | null
  setInput: (amount: string) => void
  setOutPut: (amount: string) => void
  setFee: (amount: string) => void
  getInPut: () => string
  getOutPut: () => string
  getFee: () => string
  addToHistory: (tx: txItem) => void
  getHistory: (account: string | undefined | null, isEdit: boolean) => Array<txItem>
  setGasFee: (amount: string) => void
  setToken: (dataType: boolean, data: Token | null) => void
  willReceiveToken: string
  setWillReceiveToken: (amount: string) => void
  setCustomRecipientAddress: (address: string) => void
  removeCustomRecipientAddress: () => void
  updateHistoryBytxhash: (txhash: string, toTxhash: string, serveStatus: serveStatus, statusTxt: string) => void
  error: string
  setError: (msg: string) => void
  isOpenPreview: boolean
  setOpenPreview: (isopen: boolean) => void
  quoteLoading: boolean
  setQuoteLoading: (isloading: boolean) => void
  originalinput: string
  setOriginalinput: (value: string) => void
  srcGrossPrice: string
  destGrossPrice: string
  setSrcGrossPrice: (price: string) => void
  setDestGrossPrice: (price: string) => void
  destEstimatedReceived: string
  destMinimumReceived: string
  setDestEstimatedReceived: (value: string) => void
  setDestMinimumReceived: (value: string) => void
  reset: () => void
  fromSearchKey?: string
  toSearchKey?: string
  setSearchKey: (serchKey: string, isFrom: boolean) => void
  setEnableKeplr: (enable: boolean) => void
  getEnableKeplr: () => boolean
}

export const intialState = {
  counter: 0,
  fromChain: null,
  toChain: null,
  fromChainID: null,
  toChainID: null,
  input: '0',
  output: '0',
  fee: '0',
  gasFee: '0',
  history: [],
  fromToken: null,
  toToken: null,
  willReceiveToken: '0',
  CustomRecipientAddress: null,
  error: '',
  isOpenPreview: false,
  quoteLoading: false,
  originalinput: '0',
  srcGrossPrice: '0',
  destGrossPrice: '0',
  destEstimatedReceived: '0',
  destMinimumReceived: '0',
  enableKeplr: false,
  cosmosAddress: null
}

const createMyStore = (state: typeof intialState = intialState) => {
  return createStore<AppState, [['zustand/devtools', never], ['zustand/immer', never], ['zustand/persist', AppState]]>(
    devtools(
      immer(
        persist(
          (set, get) => ({
            ...state,
            increase: () =>
              set(state => {
                state.counter++
              }),
            setFromOrTOChain: (data: L1ChainInfo | L2ChainInfo, dataType: boolean, chainID: SupportedChainId) => {
              if (dataType == true) {
                set(state => {
                  state.fromChain = data
                  state.fromChainID = chainID
                })
              } else {
                set(state => {
                  state.toChain = data
                  state.toChainID = chainID
                })
              }
            },
            getFromChain() {
              const data = get().fromChain
              return data
            },
            getToChain() {
              const data = get().toChain
              return data
            },
            setInput: (amount: string) => {
              set(state => {
                state.input = amount
              })
            },
            setOutPut: (amount: string) => {
              set(state => {
                state.output = amount
              })
            },
            setFee: (amount: string) => {
              set(state => {
                state.fee = amount
              })
            },
            getInPut() {
              return get().input
            },
            getOutPut() {
              return get().output
            },
            getFee() {
              return get().fee
            },
            addToHistory: (tx: txItem) => {
              const history = get().history
              const data = history.find((item: txItem) => {
                return item.txhash == tx.txhash
              })
              if (data == undefined || data == null) {
                set(state => {
                  state.history.push(tx)
                })
              }
            },
            getHistory: (account: string | undefined | null, isPending: boolean) => {
              return get()
                .history.filter(item => {
                  if (isPending == true) {
                    return item.user == account && item.status == undefined
                  } else {
                    return item.user == account && item.status !== undefined
                  }
                })
                .sort((a, b) => b.creattime - a.creattime)
            },
            setGasFee: (amount: string) => {
              set(state => {
                state.gasFee = amount
              })
            },
            setWillReceiveToken: (amount: string) => {
              set(state => {
                state.willReceiveToken = amount
              })
            },
            setCustomRecipientAddress: (address: string) => {
              set(state => {
                state.CustomRecipientAddress = address
              })
            },
            removeCustomRecipientAddress: () => {
              set(state => {
                state.CustomRecipientAddress = null
              })
            },
            updateHistoryBytxhash: (txhash: string, toTxhash: string, serveStatus: serveStatus, statusTxt: string) => {
              //  get().history.filter((item)=>item.txhash==txhash)
              set(state => {
                const item = state.history.find(item => item.txhash == txhash)
                if (item) {
                  item.toTxhash = toTxhash
                  item.status = statusTxt
                  item.serveStatus = serveStatus
                }
              })
            },
            setError: (msg: string) => {
              set(state => {
                state.error = msg
              })
            },
            setOpenPreview: (isopen: boolean) => {
              set(state => {
                state.isOpenPreview = isopen
              })
            },
            setQuoteLoading: (isloading: boolean) => {
              set(state => {
                state.quoteLoading = isloading
              })
            },
            setOriginalinput: (value: string) => {
              set(state => {
                state.originalinput = value
              })
            },
            setSrcGrossPrice: (price: string) => {
              set(state => {
                state.srcGrossPrice = price
              })
            },
            setDestGrossPrice: (price: string) => {
              set(state => {
                state.destGrossPrice = price
              })
            },
            setDestEstimatedReceived: (value: string) => {
              set(state => {
                state.destEstimatedReceived = value
              })
            },
            setDestMinimumReceived: (value: string) => {
              set(state => {
                state.destMinimumReceived = value
              })
            },
            reset: () => {
              set(intialState)
            },
            setEnableKeplr: (isEnable: boolean) => {
              set(state => {
                state.enableKeplr = isEnable
              })
            },
            getEnableKeplr: () => {
              return get().enableKeplr
            },
            setCosmosAddress: (address: string) => {
              set(state => {
                state.cosmosAddress = address
              })
            },
            getCosmosAddress: () => {
              return get().cosmosAddress
            },
            setSearchKey: (serchKey: string, isFrom: boolean) => {
              set(state => {
                if (isFrom) {
                  state.fromSearchKey = serchKey
                } else {
                  state.toSearchKey = serchKey
                }
              })
            },
            setToken: (dataType: boolean, data: Token | null) => {
              set(state => {
                if (dataType) {
                  state.fromToken = data
                } else {
                  state.toToken = data
                }
              })
            }
          }),
          {
            name: 'app-storage-v0.1',
            partialize: state => ({
              ...state
              // error: ''
            })
          }
        )
      )
    )
  )
}

const MyStoreContext = createContext<ReturnType<typeof createMyStore> | null>(null)

export const AppStoreProvider: FC<{ children: React.ReactNode; data?: typeof intialState }> = ({ children, data }) => {
  const store = createMyStore(data || intialState)
  // console.log('===========', store)

  return <MyStoreContext.Provider value={store}>{children}</MyStoreContext.Provider>
}

export function useAppStore(): AppState
export function useAppStore<T>(selector: (store: AppState) => T, equalityFn?: (left: T, right: T) => boolean): T
export function useAppStore<T>(selector?: (store: AppState) => T, equalityFn?: (left: T, right: T) => boolean) {
  const store = useContext(MyStoreContext)

  if (!store) {
    throw new Error('MyStoreContext is not provided !')
  }
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return useStore(store, selector as any, equalityFn)
}
