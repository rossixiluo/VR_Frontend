import React, { FC } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { ToastProvider, DefaultToast } from 'react-toast-notifications'
import 'react-loading-skeleton/dist/skeleton.css'
import { SWRConfig } from 'swr'
import UpdateHistory from '../components/noticeinfo/updateHistory'

//eslint-disable-next-line  @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 8000 // frequency provider is polling
  return library
}

type Props = {
  children?: React.ReactNode
}

export const MyCustomToast = ({ children, ...props }: { children: React.ReactNode }) => (
  //eslint-disable-next-line   @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <DefaultToast {...props}>
    <div className="  break-all">{children}</div>
  </DefaultToast>
)
export const Web3Provider: FC<Props> = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastProvider components={{ Toast: MyCustomToast }} autoDismiss={true} autoDismissTimeout={2000} placement={'top-center'}>
        <SWRConfig
          value={{
            refreshInterval: 0
          }}
        >
          {children}
          <UpdateHistory></UpdateHistory>
        </SWRConfig>
      </ToastProvider>
    </Web3ReactProvider>
  )
}
