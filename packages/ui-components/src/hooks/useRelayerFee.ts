import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state'
import useRelayerAddress from './useRelayer'
import UsdcRelayerABI from '../constants/ABI/UsdcRelayer.json'
import { Circle_Chainid } from '../constants/relayer'
import { RPC_URLS } from '../constants/networks'
import useSWR from 'swr'
import { useMemo } from 'react'
import useUSDCAddress from './useUsdc'

export default function useRelayerFee() {
  const toChainID = useAppStore(state => state.toChainID)
  const fromChainID = useAppStore(state => state.fromChainID)

  const contractAddress = useRelayerAddress()
  const setFee = useAppStore(state => state.setFee)
  const toToken = useAppStore(state => state.toToken)
  const usdcTo = useUSDCAddress(toChainID)

  const isToNeedSwap = useMemo(() => {
    if (toToken?.address.toLowerCase() != usdcTo?.toLowerCase() && fromChainID !== toChainID) {
      return true
    } else {
      return false
    }
  }, [toToken, usdcTo, fromChainID, toChainID])

  const { data, error, isLoading } = useSWR([contractAddress, toChainID, fromChainID, 'useRelayerFee'], async ([contractAddress, toChainID, fromChainID]) => {
    // setValue('0')
    // setFee('0')
    // console.log('= =')
    if (contractAddress && toChainID !== null && fromChainID !== null && toChainID !== fromChainID) {
      const rpc = RPC_URLS[fromChainID][0]
      const prcPro = new providers.StaticJsonRpcProvider(rpc)

      const CircleID = Circle_Chainid[toChainID]
      const contract = new Contract(contractAddress, UsdcRelayerABI, prcPro)

      const result: BigNumber[] = await contract._fee(CircleID)
      // console.log(result)
      return result
    }
  })

  const numFee = useMemo(() => {
    if (data == undefined) return
    let result
    if (isToNeedSwap) {
      result = BigNumber.from(data[1]).toString()
    } else {
      result = BigNumber.from(data[0]).toString()
    }
    setFee(result)
    return result
  }, [data, isToNeedSwap, setFee])

  // useEffect(() => {
  //   const run = async () => {
  //     console.log('useRelayerFee')
  //     setValue('0')
  //     setFee('0')
  //     if ( contractAddress && library != undefined&&toChainID!==null&&fromChainID!==null&&toChainID!==fromChainID) {

  //       const rpc= RPC_URLS[fromChainID][0]
  //       const prcPro= new providers.JsonRpcProvider(rpc)

  //       const CircleID = Circle_Chainid[toChainID]
  //       const contract = new Contract(contractAddress, UsdcRelayerABI, prcPro)

  //       const result: BigNumber = await contract.feeByDestinationDomain(CircleID)
  //       if(result.eq(0)){
  //         setValue(ethers.utils.parseEther('0.0001').toString())
  //         setFee(ethers.utils.parseEther('0.0001').toString())
  //       }else{

  //         setValue(result.toString())
  //         setFee(result.toString())
  //       }

  //     }
  //     setIsloading(false)
  //   }

  //   setIsloading(true)
  //   run()

  // }, [library, contractAddress,chainId,toChainID,setFee,fromChainID,setIsloading])

  return {
    fee: numFee,
    isloading: isLoading,
    error
  }
}
