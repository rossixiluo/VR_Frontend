
import {providers} from '@monorepo/ui-components'
declare global {
  interface Window {
    ethereum: providers.ExternalProvider;
  }
}
