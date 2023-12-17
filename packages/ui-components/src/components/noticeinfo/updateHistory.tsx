import { useMemo } from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useAppStore } from '../../state'
import Txinfo from './updateTxinfo'
import { useWeb3React } from '@web3-react/core'

export const UpdateHistory = () => {
  const { account } = useWeb3React()

  const list = useAppStore(state => state.getHistory(account, true))

  const listOrder = useMemo(() => {
    return list.sort((a, b) => {
      return b.creattime - a.creattime
    })
  }, [list])
  return (
    <div className=" hidden">
      {listOrder.map((item, key) => {
        return <Txinfo key={key} Item={item}></Txinfo>
      })}
    </div>
  )
}

export default UpdateHistory
