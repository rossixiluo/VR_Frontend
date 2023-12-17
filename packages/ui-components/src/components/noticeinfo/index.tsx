import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useCallback, useMemo, useState } from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useAppStore } from '../../state'
import Txinfo from './txinfo'
import { useWeb3React } from '@web3-react/core'
import { When } from 'react-if'
import { BellIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'

export default function Noticeinfo() {
  const [isOpen, setIsOpen] = useState(false)
  const { account } = useWeb3React()
  const Navigate = useNavigate()

  const list = useAppStore(state => state.getHistory(account, true))

  const listOrder = useMemo(() => {
    return list.sort((a, b) => {
      return b.creattime - a.creattime
    })
  }, [list])

  function closeModal() {
    setIsOpen(false)
  }

  const openModal = useCallback(
    function () {
      if (account !== null && account !== undefined) {
        setIsOpen(true)
      }
    },
    [account]
  )
  if (account == undefined) {
    return <></>
  }

  return (
    <>
      <div
        onClick={openModal}
        className="relative    cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-80 "
      >
        {/* <FontAwesomeIcon icon={icon({ name: 'bell', style: 'solid' })} /> */}
        <BellIcon className=" w-4 h-4"></BellIcon>
        <When condition={account && list.length > 0}>
          <span className="absolute  rounded-full bg-red-400 py-0 px-1.5 text-xs text-white">{list.length}</span>
        </When>
      </div>

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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Pending Transactions
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      <dl className="max-w-lg text-gray-900 divide-y  max-h-96 overflow-y-scroll divide-gray-200 dark:text-white dark:divide-gray-700">
                        {listOrder.map((item, key) => {
                          return <Txinfo key={key} Item={item}></Txinfo>
                        })}
                      </dl>
                      <When condition={listOrder.length == 0}>
                        <div className=" text-center   p-4 ">
                          <div className=" font-bold text-lg   text-black">No pending transactions</div>
                          <div>Active transactions on ValueRouter will appear here</div>
                          <div className=" flex mt-20">
                            <button
                              type="button"
                              onClick={() => {
                                closeModal()
                                Navigate('/transactions')
                              }}
                              className="text-white  outline-none flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
                            >
                              View all transactions
                            </button>
                          </div>
                        </div>
                      </When>
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
