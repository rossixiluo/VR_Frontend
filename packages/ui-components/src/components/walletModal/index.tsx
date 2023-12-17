import { Dialog, Transition } from '@headlessui/react'
import { Fragment, FC } from 'react'

import connectors from '../../web3react/connectors'
import { useToasts } from 'react-toast-notifications'
import { useWeb3React } from '@web3-react/core'
// import { accountDataType } from '../../web3react/types'
import { useEffect, useCallback } from 'react'
import EventEmitter from '../../EventEmitter/index'
import metamask from '../../assets/icon/metamask.svg'
import { useCookie } from 'react-use'
import keplr from '../../assets/keplr.webp'
import useKeplr from '../../hooks/useKeplr'

interface componentprops {
  isOpen: boolean
  closeModal: () => void
}

const WalletModal: FC<componentprops> = ({ isOpen, closeModal }) => {
  ////
  const { addToast } = useToasts()
  const { activate } = useWeb3React()
  const [walletIsConnectvalue, updateCookie] = useCookie('walletIsConnectedTo')
  const { enableKeplr } = useKeplr()
  // const [accountData, setAccountData] = useState<null | accountDataType>(null)
  // const noderef= useRef()

  const connectMetaMask = useCallback(async () => {
    let status = false
    console.info('connectMetaMask')
    await activate(connectors.metamask, (err: Error) => {
      addToast(err.message, { appearance: 'error' })
      if (err.message.indexOf('UnsupportedChainId')) {
        EventEmitter.emit('UnsupportedChainId', true)
      } else {
        EventEmitter.emit('UnsupportedChainId', false)
      }

      status = true
    })

    if (!status) {
      // addToast('Connected to MetaMask', { appearance: 'success' })
      // localStorage.setItem('walletIsConnectedTo', 'metamask')
      updateCookie('metamask', { expires: 30, path: '/' })
      closeModal()
    }
  }, [activate, addToast, closeModal, updateCookie])

  const connectWalletConnect = useCallback(async () => {
    let status = false
    await activate(connectors.walletConnect, (err: Error) => {
      addToast(err.message, { appearance: 'error' })
      if (err.message.indexOf('UnsupportedChainId')) {
        EventEmitter.emit('UnsupportedChainId', true)
      } else {
        EventEmitter.emit('UnsupportedChainId', false)
      }
      status = true
    })

    if (!status) {
      // localStorage.setItem('walletIsConnectedTo', 'walletConnect')
      updateCookie('walletConnect', { expires: 30, path: '/' })
      // addToast('Connected to Wallet Connect', { appearance: 'success' })
      closeModal()
    }
  }, [activate, addToast, closeModal, updateCookie])
  // const disConnect = async () => {
  //   deactivate()

  //   localStorage.removeItem('walletIsConnectedTo')

  //   // setAccountData(null)
  // }
  const walletsToDisplay = [
    { id: 1, title: 'MetaMask', imgSrc: metamask, fn: connectMetaMask }
    // { id: 3, title: 'WalletConnect', imgSrc: '', fn: connectWalletConnect }
  ]
  // connect on load
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      console.info('connectWalletOnPageLoad')
      if (walletIsConnectvalue?.trim() === 'metamask') {
        await connectMetaMask()
      }

      if (walletIsConnectvalue?.trim() === 'walletConnect') {
        await connectWalletConnect()
      }
    }
    // if(active==false){
    connectWalletOnPageLoad()
    // }
  }, [connectMetaMask, connectWalletConnect, walletIsConnectvalue])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Select Wallet
                  </Dialog.Title>
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 flex flex-col ">
                      {walletsToDisplay.map(el => (
                        <div className="my-1 flex-1" key={el.id}>
                          <button
                            key={el.id}
                            onClick={el.fn}
                            type="button"
                            className="text-gray-900 bg-white w-full hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 min-w-full"
                          >
                            <img src={el.imgSrc} className="w-6 h-5 mr-2 -ml-1"></img>
                            {el.title}
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          enableKeplr()
                          closeModal()
                        }}
                        className="text-gray-900 bg-white w-full hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 min-w-full"
                      >
                        <img src={keplr} className="w-6 h-5 mr-2 -ml-1"></img>
                        Keplr
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default WalletModal
