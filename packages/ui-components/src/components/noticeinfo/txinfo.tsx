import { FC, useMemo } from 'react'
import { txItem } from '../../state/index'

import dayjs from '../../utils/dayjs'

import { Else, If, Then, When } from 'react-if'

import TokenAndChainInfo from './TokenAndChainInfo'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
import { useStatusMintTxt } from '../../hooks/useStatusMintTxt'

//txItem
const Txinfo: FC<{ Item: txItem }> = ({ Item }) => {
  const isLocalSwap = useMemo(() => {
    return Item.fromChainID == Item.toChainID
  }, [Item.fromChainID, Item.toChainID])
  const statusMint = useStatusMintTxt(Item.txhash, isLocalSwap, Item.fromChainID)
  // Item.fromChainID
  // Item.toChainID

  //{"code":0,"data":{"attest":"done","mint":"done","scan":"done"}}

  // useEffect(()=>{
  //     if(statusMint.text=='Success'&&status.data?.data.to?.txhash){
  //         updateHistoryBytxhash(Item.txhash,status.data?.data.to?.txhash)
  //     }

  // },[statusMint.text,updateHistoryBytxhash,Item.txhash,status.data?.data.to?.txhash])

  return (
    <div className="flex flex-col pb-3 mt-2 pt-2">
      <div className=" flex flex-col sm:flex-row justify-around   items-stretch">
        <TokenAndChainInfo Tokeninfo={Item.fromToken} ChainID={Item.fromChainID} Amount={Item.input} isFrom={true} txhash={Item.txhash}></TokenAndChainInfo>
        <div className=" flex">
          <span className=" m-auto p-2">
            <ChevronDoubleRightIcon className=" w-4 h-4"></ChevronDoubleRightIcon>
          </span>
        </div>
        <TokenAndChainInfo
          Tokeninfo={Item.toToken}
          ChainID={Item.toChainID}
          Amount={Item.output}
          isFrom={false}
          txhash={statusMint.toTxhash}
        ></TokenAndChainInfo>
      </div>

      <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">Time: {dayjs(Item.creattime).fromNow()}</dt>
      <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">
        State:
        <If condition={statusMint.isLoading}>
          <Then>
            <span>Loading</span>
          </Then>
          <Else>
            <When condition={statusMint.step == 3}>
              <span className=" text-green-600">Success</span>
            </When>
            <When condition={statusMint.step != 3}>
              <span className=" text-yellow-400">{statusMint.text}</span>
            </When>
          </Else>
        </If>
      </dt>
    </div>
  )
}

export default Txinfo
