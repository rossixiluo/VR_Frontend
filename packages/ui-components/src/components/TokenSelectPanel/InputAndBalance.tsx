import { FC, useState, useCallback, useEffect } from 'react'
import Balance from './Balance'
import useErc20Balance from '../../hooks/useErc20Balance'
import { useAppStore } from '../../state'
import { validateAmount } from '../../utils'
import { BigNumber, ethers } from 'ethers'
import { useDebounce } from 'react-use'
import useEthBalance from '../../hooks/useEthBalance'

type proteType = {
  isFrom: boolean
}

const InputAndBalance: FC<proteType> = ({ isFrom }) => {
  const fromToken = useAppStore(state => state.fromToken)
  const fromChainID = useAppStore(state => state.fromChainID)
  const usdcBalance = useErc20Balance(fromToken?.address)
  const ethBalance = useEthBalance()

  const [inputError, setinputError] = useState<string | undefined>()
  const setInput = useAppStore(state => state.setInput)
  const setWillReceiveToken = useAppStore(state => state.setWillReceiveToken)

  const originalinput = useAppStore(state => state.originalinput)
  const setOriginalinput = useAppStore(state => state.setOriginalinput)

  const setGasFeeStore = useAppStore(state => state.setGasFee)
  const setError = useAppStore(state => state.setError)
  const protocolFee = useAppStore(state => state.getFee)

  // const inputAmount = useMemo(() => {
  //   const valueHaveUnits = ethers.utils.formatUnits(input, fromToken?.decimals).toString()
  //   return valueHaveUnits
  // }, [input, fromToken])

  const [inputValue, setInputValue] = useState(originalinput)

  // useEffect(() => {
  //   setInputValue(inputAmount)
  // }, [inputAmount, setInputValue])

  useDebounce(
    () => {
      setOriginalinput(inputValue)

      if (inputError == undefined) {
        if (inputValue !== '') {
          const valueHaveUnits = ethers.utils.parseUnits(inputValue, fromToken?.decimals).toString()
          setInput(valueHaveUnits)
        } else {
          setInput('0')
        }
        setError('')
      } else {
        setError(inputError)
        // setInput('0')
      }
    },
    500,
    [inputValue, inputError, fromToken, setError, setOriginalinput]
  )

  const inputAmountChange = useCallback(
    (value: string) => {
      // startTransition(()=>{

      setinputError(undefined)
      if (value == '' || fromToken == null || ethBalance.balance == undefined) return
      const error = validateAmount(value, fromToken.decimals)
      if (error == undefined) {
        const valueHaveUnits = ethers.utils.parseUnits(value, fromToken?.decimals).toString()
        const protocolFeeBigNum = BigNumber.from(protocolFee())
        const ethBalanceamount = BigNumber.from(ethBalance.balance)

        if (usdcBalance.balance != undefined && fromToken?.address !== '') {
          const inputAmount = BigNumber.from(valueHaveUnits)
          const usdcBalanceamount = BigNumber.from(usdcBalance.balance)

          if (inputAmount.gt(usdcBalanceamount)) {
            setinputError('The value entered is greater than the balance')
          }
          if (protocolFeeBigNum.gt(ethBalanceamount)) {
            setinputError('The native token balance is insufficient to pay the handling fee')
          }
        } else if (ethBalance.balance !== undefined && fromToken?.address == '') {
          const inputAmount = BigNumber.from(valueHaveUnits)

          if (inputAmount.add(protocolFeeBigNum).gt(ethBalanceamount)) {
            setinputError('The value entered and protocol fee is greater than the balance')
          }
        }
      } else {
        setinputError(error)
      }
      // })
    },
    [fromToken, setinputError, usdcBalance, ethBalance, protocolFee]
  )
  useEffect(() => {
    if (fromChainID && fromToken) {
      setTimeout(() => {
        inputAmountChange(inputValue)
      }, 200)
    }
  }, [fromToken, fromChainID, inputAmountChange, inputValue])

  const setValue = useCallback(
    (value: string) => {
      setInputValue(value)
      inputAmountChange(value)
      setWillReceiveToken('0')
      setGasFeeStore('0')
    },
    [inputAmountChange, setWillReceiveToken, setGasFeeStore]
  )

  return (
    <div className="flex items-center justify-between px-3 py-[14px] sm:py-4">
      <div className="relative flex w-full items-center overflow-hidden">
        <input
          type="number"
          className="skt-w skt-w-input text-valuerouter-primary w-full min-w-full max-w-[180px] bg-transparent pt-0.5 text-lg font-bold focus:max-w-none focus-visible:outline-none sm:max-w-full sm:text-xl"
          placeholder={'0.0'}
          spellCheck="false"
          disabled={!isFrom}
          value={inputValue}
          onChange={e => {
            setValue(e.currentTarget.value)
          }}
        />
        <div className="invisible absolute w-fit text-xl font-bold" />
      </div>
      <Balance isFrom={isFrom}></Balance>
    </div>
  )
}

export default InputAndBalance
