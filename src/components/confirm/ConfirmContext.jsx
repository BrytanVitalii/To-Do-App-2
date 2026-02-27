import { createContext, useContext } from "react"

const ConfirmContext = createContext(null)

export const useConfirm = () => {
  const confirm = useContext(ConfirmContext)
  if(!confirm) {
    throw new Error("useConfirm must be used inside ConfirmProvider")
  }
  return confirm
}

export default ConfirmContext