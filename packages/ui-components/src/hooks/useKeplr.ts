import { useCallback, useEffect, useState } from 'react'
import { Keplr, AccountData, OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types'
import { useAppStore } from '../state'
//https://github.com/chainapsis/keplr-wallet/blob/master/packages/extension/src/config.ts
// import from '@keplr-wallet/types/build/'
// node_modules/@keplr-wallet/types/build/cosmjs.d.ts
const getKeplr = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr
  }

  if (document.readyState === 'complete') {
    return window.keplr
  }

  return new Promise(resolve => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        resolve(window.keplr)
        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}
export default function useKeplr() {
  const [accounts, setAccounts] = useState<readonly AccountData[]>()
  const [offlineSigner, setOfflineSigner] = useState<OfflineAminoSigner & OfflineDirectSigner>()
  const isKeplr = useAppStore(state => {
    return state.getEnableKeplr()
  })
  const setCosmosAddress = useAppStore(state => state.setCosmosAddress)

  const setKeplr = useAppStore(state => {
    return state.setEnableKeplr
  })

  const enableKeplr = useCallback(async () => {
    const chainId = 'noble-1'

    const Keplr = await getKeplr()
    Keplr?.enable(chainId)
    const offlineSigner = Keplr?.getOfflineSigner(chainId)
    const accounts = await offlineSigner?.getAccounts()
    if (accounts) {
      setAccounts(accounts)
    }
    if (offlineSigner) {
      setOfflineSigner(offlineSigner)
    }
    console.log(accounts, offlineSigner)
    if (accounts !== undefined && accounts?.length > 0) {
      setCosmosAddress(accounts[0].address)
    }
    setKeplr(true)
  }, [setKeplr, setCosmosAddress])

  useEffect(() => {
    if (isKeplr) {
      enableKeplr()
    }
  }, [enableKeplr, isKeplr])
  return {
    accounts,
    offlineSigner,
    enableKeplr
  }
}
