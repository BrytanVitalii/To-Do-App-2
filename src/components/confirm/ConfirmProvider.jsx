import { useState } from "react"
import ConfirmContext from "@/components/confirm/ConfirmContext"
import ConfirmationModal from "@/components/confirm/ConfirmationModal"

const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null)

    const confirm = (options) => {
        setConfig(options)
    }

    const close = () => {
        setConfig(null)
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <ConfirmationModal
                open={!!config}
                {...config}
                onClose={close}
            />
        </ConfirmContext.Provider>
    )
}

export default ConfirmProvider