import { useAppStore } from '../state'
export default function useCusRecipientAddress() {
  const CustomRecipientAddress = useAppStore(state => state.CustomRecipientAddress)
  return CustomRecipientAddress
}
