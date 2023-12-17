import { useAppStore } from '../../state'

const ProtectedError = ({ children, className }: { children: JSX.Element; className?: string }) => {
  const error = useAppStore(state => state.error)
  if (error !== '') {
    return (
      <button
        disabled
        className="px-6 py-3.5 text-white flex-1 bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {' '}
        {error}
      </button>
    )
  }
  return children
}

export default ProtectedError
