import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useErc20Approve from '../../hooks/useApprove'
import useErcCheckAllowance from '../../hooks/useCheckAllowance'
import { useAppStore } from '../../state'
import Loading from '../loading'

import { useToasts } from 'react-toast-notifications'
import EventEmitter from '../../EventEmitter/index'

const ProtectedApprove = ({ children, className }: { children: JSX.Element; className?: string }) => {
  const ApproveUSDT = useErc20Approve()
  const checkAllowance = useErcCheckAllowance()
  const inputNumer = useAppStore(state => state.input)
  const [isLoading, setIsisLoading] = useState(false)
  const clickRef = useRef<boolean>(false)

  const { addToast } = useToasts()
  const fromToken = useAppStore(state => state.fromToken)

  const allowance = useMemo(() => {
    const result = checkAllowance.Validation(inputNumer)

    return result
  }, [checkAllowance, inputNumer])

  const Submit = useCallback(async () => {
    if (clickRef.current) {
      return
    }
    clickRef.current = true
    setIsisLoading(true)
    const result = await ApproveUSDT.doFetch()

    if (result !== undefined && result instanceof Error === false) {
      result.wait([1])
      EventEmitter.emit('Refresh')
    }
    clickRef.current = false
  }, [ApproveUSDT, setIsisLoading])

  useEffect(() => {
    // console.log('ApproveUSDT.state.error',ApproveUSDT.state)
    if (ApproveUSDT.state.error !== undefined) {
      setIsisLoading(false)

      addToast(ApproveUSDT.state.error.message, { appearance: 'error', autoDismissTimeout: 1000 * 5 })
    }
  }, [ApproveUSDT.state.error, addToast])

  useEffect(() => {
    if (allowance) {
      setIsisLoading(false)
    }
  }, [allowance, setIsisLoading])

  if (allowance == true || fromToken?.address == '') {
    return children
  }

  // return (<button
  //      onClick={()=>{
  //       console.log('****')
  //       EventEmitter.emit("Refresh")}}
  //       className="px-6 py-3.5 text-white flex-1  bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
  //     >
  //      test
  //     </button>)

  if (inputNumer == '0') {
    return (
      <button
        disabled
        className="px-6 py-3.5 text-white flex-1  bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait"
      >
        Approve
      </button>
    )
  }

  if (isLoading) {
    return (
      <button className="px-6 py-3.5 text-white flex-1 flex  flex-row   bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait">
        <Loading></Loading>
        <div className=" flex-1 text-center">Approve loading</div>
      </button>
    )
  }

  return (
    <button
      onClick={Submit}
      className="px-6 py-3.5 text-white flex-1  bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Approve
    </button>
  )
}

export default ProtectedApprove
