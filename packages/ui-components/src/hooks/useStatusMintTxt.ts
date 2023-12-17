import { useMemo } from 'react'
import { SupportedChainId } from '../constants/chains'
import useTxStatus from './useTxStatus'

export function useStatusMintTxt(txhash: string | null, isLocalSwap: boolean, fromChainID: SupportedChainId | null) {
  const status = useTxStatus(txhash, isLocalSwap, fromChainID)
  const statusMint = useMemo(() => {
    const statusText = {
      text: 'Waiting for send',
      step: -1,
      isLoading: status.isLoading,
      isLoadingLocaL: status.isLoadingLocaL,
      toTxhash: status.data?.data.to?.tx_hash,
      serveStatus: {
        attest: status.data?.data.attest,
        mint: status.data?.data.mint,
        scan: status.data?.data.scan,
        swap: status.data?.data.swap
      }
    }
    if (txhash !== null) {
      statusText.text = 'Waiting for scan'
      statusText.step = 0
    }
    if (status.isLocalSwap == false && status.data && status.data.data) {
      if (status.data.data.scan == 'done') {
        statusText.text = 'Waiting for attest'
        statusText.step = 1
      }
      if (status.data.data.attest == 'done') {
        statusText.text = 'Waiting for mint'
        statusText.step = 2
      }
      if (status.data.data.mint == 'done') {
        statusText.text = 'Success'
        statusText.step = 3
      }
      if (status.data.data.mint == 'fail' || status.data.data.attest == 'fail' || status.data.data.scan == 'fail' || status.data.data.swap == 'fail') {
        // if (status.data.data.swap == 'fail') {
        //   // statusText.text = 'Swap failed due to slippage is too large. Users received USDC on target chain'
        // } else {
        //   statusText.text = 'Fail'
        // }
        statusText.text = 'Fail'

        statusText.step = 4
      }
    } else {
      if (status.dataLocal !== undefined) {
        if (status.dataLocal == 1) {
          statusText.text = 'Success'
          statusText.step = 3
        } else {
          statusText.text = 'Fail'
          statusText.step = 4
        }
      }
    }
    return statusText
  }, [status, txhash])
  return statusMint
}
