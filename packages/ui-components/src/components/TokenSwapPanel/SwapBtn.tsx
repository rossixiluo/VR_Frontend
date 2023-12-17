import { ProtectedConnectWallet } from '../Guard/ProtectedConnectWallet'
import ProtectedApprove from '../Guard/ProtectedApprove'
import ProtecteNetwork from '../Guard/ProtecteNetwork'
import ReviewBtnPanel from './ReviewBtnPanel'
import ProtectedError from '../Guard/ProtectedError'

const SwapBtn = () => {
  return (
    <div className="  flex">
      <ProtectedConnectWallet>
        <ProtectedError>
          <ProtecteNetwork>
            <ProtectedApprove>
              <ReviewBtnPanel></ReviewBtnPanel>
            </ProtectedApprove>
          </ProtecteNetwork>
        </ProtectedError>
      </ProtectedConnectWallet>
    </div>
  )
}

export default SwapBtn
