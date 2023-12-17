import { FC } from 'react'
import { txItem } from '../../state/index'
import TokenAndChainInfo from './TokenAndChainInfo'
import { Else, If, Then } from 'react-if'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import dayjs from '../../utils/dayjs'

const Txinfo: FC<{ Item: txItem }> = ({ Item }) => {
  // const isLocalSwap = useMemo(() => {
  //   return Item.fromChainID == Item.toChainID
  // }, [Item.fromChainID, Item.toChainID])

  return (
    <div className=" flex flex-col sm:flex-row  font-medium    py-4 px-4  items-stretch">
      {/* <div className=" w-1/3"> */}
      <TokenAndChainInfo Tokeninfo={Item.fromToken} ChainID={Item.fromChainID} Amount={Item.input} isFrom={true} txhash={Item.txhash}></TokenAndChainInfo>
      {/* </div> */}
      {/* <div className=" w-1/3"> */}
      <TokenAndChainInfo Tokeninfo={Item.toToken} ChainID={Item.toChainID} Amount={Item.output} isFrom={false} txhash={Item.toTxhash}></TokenAndChainInfo>
      {/* </div> */}
      <div className=" flex-1    flex   flex-col   items-center justify-center ">
        <div>{dayjs(Item.creattime).fromNow()}</div>
        <If condition={Item.status == 'Success'}>
          <Then>
            <div className=" inline-flex justify-center items-center w-full ">
              <CheckCircleIcon className=" w-8 h-8 text-green-700"></CheckCircleIcon>
              <span className=" text-green-700">{Item.status}</span>
            </div>
          </Then>
          <Else>
            <div className=" inline-flex justify-center items-center w-full">
              <XCircleIcon className=" w-8 h-8 text-red-600"></XCircleIcon>
              <span className="text-red-600 ">{Item.status}</span>
            </div>
            <div className=" text-yellow-400">
              {Item.serveStatus?.swap == 'fail' ? 'Swap failed due to slippage is too large. Users received USDC on target chain' : ''}
            </div>
          </Else>
        </If>
      </div>
    </div>
  )
}

export default Txinfo
