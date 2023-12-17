import TokenSelectPanel from '../TokenSelectPanel/Index'
import TokenSwichPanel from '../TokenSwichPanel'
import SwapBtn from './SwapBtn'
import TokenSwapRecipient from '../TokenSwapRecipient/Index'
import PreviewModal from '../preview'
import { useAppStore } from '../../state'
import { useCallback } from 'react'

const Index = () => {
  // const [isPreviewOpen, setPreviewOpen] = useState(false)
  const isPreviewOpen = useAppStore(state => state.isOpenPreview)
  const setOpenPreview = useAppStore(state => state.setOpenPreview)

  const closePreModel = useCallback(() => {
    setOpenPreview(false)
  }, [setOpenPreview])

  //h-[calc(100vh)
  return (
    <div className="relative flex  min-h-[calc(100vh-160px)]  flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <img
        src="https://play.tailwindcss.com/img/beams.jpg"
        alt=""
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        width={1308}
      />
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10">
        <div className="w-full   sm:w-[520px] sm:min-w-[520px] ">
          {/* part1*/}
          <div className="mb-3 flex w-full items-center justify-between">
            <span className="text-valuerouter-primary text-xl font-semibold leading-8 sm:text-2xl">Route</span>
            <div className="flex items-center"></div>
          </div>

          {/*part2*/}
          <TokenSelectPanel isFrom={true}></TokenSelectPanel>

          {/*paprt3*/}
          <TokenSwichPanel></TokenSwichPanel>
          {/*part2*/}
          <TokenSelectPanel isFrom={false}></TokenSelectPanel>
          {/*part3 */}
          <div className="mb-4" />
          <SwapBtn></SwapBtn>
          <div className="mb-4" />
          <div>
            <TokenSwapRecipient></TokenSwapRecipient>
          </div>
          <PreviewModal isOpen={isPreviewOpen} closeModal={closePreModel}></PreviewModal>
        </div>
      </div>
    </div>
  )
}

export default Index
