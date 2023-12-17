import { FC } from 'react'
import { Else, If, Then } from 'react-if'

import Erc20Balance from '../balance/Erc20Balance'
import EthBalance from '../balance/EthBalance'
import { SupportedChainId } from '../../constants/chains'

type prop = {
  tokenAddress: string
  decimals: number
  chainid: SupportedChainId
}

const TokenBalance: FC<prop> = ({ tokenAddress, decimals, chainid }) => {
  return (
    <div>
      <If condition={tokenAddress !== ''}>
        <Then>
          <Erc20Balance tokenAddress={tokenAddress} decimals={decimals}></Erc20Balance>
        </Then>
        <Else>
          <EthBalance chainid={chainid}></EthBalance>
        </Else>
      </If>
    </div>
  )
}

export default TokenBalance
