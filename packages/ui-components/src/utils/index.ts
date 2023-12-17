import { ethers, BigNumber } from 'ethers'
import numbro from 'numbro'
import { getChainInfo } from '../constants/chainInfo'

function numFormat(value: string | number, mantissa?: number) {
  const string = numbro(value).format({ thousandSeparated: true, mantissa: mantissa || 6, trimMantissa: true })
  return string
}

export function cutOut(str: string, start: number, end: number) {
  // console.log(str)
  if (!str) return ''
  const str1 = str.substr(0, start)
  const str2 = str.substr(str.length - end)
  return (str = str1 + '…' + str2)
}
export function formatUnits(chainId: number | undefined, value: string | number | undefined, isfee?: boolean, isforshort = true) {
  const chainInfo = getChainInfo(chainId)

  if (chainInfo && value !== undefined) {
    const num = ethers.utils.formatUnits(value.toString(), chainInfo?.nativeCurrency.decimals)
    if (isfee) {
      return numFormat(num, 14) + ' ' + chainInfo?.nativeCurrency.symbol.toUpperCase()
    }
    const result = parseFloat(num)
    if (isforshort == false) {
      return num
    }

    if (result < 0.000001 && result > 0) {
      return '<0.000001' + chainInfo?.nativeCurrency.symbol.toUpperCase()
    } else {
      return numFormat(num) + ' ' + chainInfo?.nativeCurrency.symbol.toUpperCase()
    }
  } else {
    return '...'
  }
}
export function formatUnitsErc20(value: string | number | undefined, symbol: string, decimals: number) {
  if (value !== undefined && decimals) {
    const num = ethers.utils.formatUnits(value.toString(), decimals)
    const result = parseFloat(num)
    if (result < 0.000001 && result > 0) {
      return '<0.000001' + ' ' + symbol.toUpperCase()
    }
    return numFormat(num) + ' ' + symbol.toUpperCase()
  } else {
    return '...'
  }
}

export const validateAmount = (amount: string, decimals: number) => {
  if (!amount || isNaN(Number(amount))) {
    return 'The value must be a number'
  }
  // const rule1 = /^(?!0\d)\d+(\.\d{1,6})?$/
  // const rule2 = /^(?!0\d)\d+(\.\d{1,18})?$/
  const rule3 = new RegExp('^(?!0\\d)\\d+(\\.\\d{1,' + decimals + '})?$')
  const isnum = rule3.test(amount)

  if (isnum == false) {
    return `The value must be a number,with ${decimals} decimal places`
  }

  if (parseFloat(amount) < 0) {
    return 'The value must be greater than 0'
  }
}

export function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export function perThousandRatioForFee(num: BigNumber, data: BigNumber) {
  const result = num
    .mul(1000 - data.toNumber())
    .div(1000)
    .toString()

  return result
}

/**
 * Returns the gas value plus a margin for unexpected or variable gas costs
 * @param value the gas value to pad
 */
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100)
}

/**
 * Reduced by percentage
 * @param value the gas value to pad
 */
export function percentageValue(value: BigNumber, num: number): BigNumber {
  return value.mul(100 - num).div(100)
}

/**
 * Reduced by thousandths ratio
 * @param value the gas value to pad
 */
export function ThousandageValue(value: BigNumber, num: number): BigNumber {
  return value.mul(1000 - num).div(1000)
}

export function IncreasingPercentageValue(value: string | undefined, num: number): string {
  if (value == undefined) {
    return '0'
  }
  return BigNumber.from(value)
    .mul(100 + num)
    .div(100)
    .toString()
}
