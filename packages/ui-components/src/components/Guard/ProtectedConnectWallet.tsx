import { useWeb3React } from '@web3-react/core'
import EventBus from '../../EventEmitter/index'
import { useCallback } from 'react'

export const ProtectedConnectWallet = ({ children, className }: { children: JSX.Element; className?: string }) => {
  const { account } = useWeb3React()

  const connectWallet = useCallback(() => {
    EventBus.emit('connectwallet')
  }, [])

  if (account == undefined || account == null) {
    return (
      <button
        onClick={connectWallet}
        className="px-6 py-3.5 text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Connect wallet
      </button>
    )
  }

  return children
}
