import { FC, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import metamask from '../../assets/icon/metamask.svg'
import WalletModal from '../walletModal'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { When } from 'react-if'
// import {getChainInfo} from '../../constants/chainInfo'
import AccountInfo from '../accountInfo/index'
import EventBus from '../../EventEmitter/index'
import keplr from '../../assets/keplr.webp'

const Connectwallet: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [, setwalletName] = useState<string>('')
  // const [chianName,setchianName]=useState<string>("")
  const { chainId, account } = useWeb3React()

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  useEffect(() => {
    const name = localStorage.getItem('walletIsConnectedTo')
    if (name != null) {
      setwalletName(name)
      //   const ChainInfo =  getChainInfo(chainId)
      //  if(ChainInfo?.label){
      //   // setchianName(ChainInfo?.label)
      //  }
    }
  }, [chainId])
  useEffect(() => {
    EventBus.on('connectwallet', () => {
      setIsOpen(true)
    })
    return () => {
      EventBus.off('connectwallet')
    }
  }, [setIsOpen])

  return (
    <>
      <When condition={account !== undefined}>
        <AccountInfo>
          <div className="hidden sm:flex flex-row  py-1 text-xl mr-1 space-x-1 ">
            <img width={20} src={metamask}></img>
            <img width={20} src={keplr}></img>
          </div>
          <div className="flex  flex-col  text-sm mr-1">
            {/* <div className="">{walletName}</div> */}
            <div className="">Connected</div>
          </div>
          <div className="py-1">
            <FontAwesomeIcon icon={icon({ name: 'chevron-down', style: 'solid' })} />
          </div>
        </AccountInfo>
      </When>
      <When condition={account === undefined}>
        <button
          onClick={openModal}
          type="button"
          className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          Connect wallet
        </button>
      </When>

      <WalletModal closeModal={closeModal} isOpen={isOpen}></WalletModal>
    </>
  )
}

export default Connectwallet
