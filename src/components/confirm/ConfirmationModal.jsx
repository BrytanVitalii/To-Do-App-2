import { createPortal } from "react-dom"

const ConfirmationModal = ({ 
    onClose,
    open, 
    title, 
    description, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    onConfirm = null,
    confirmVariant = "default",
}) => {
    // Dont show if not open
    if(!open) return null

    const confirmStyles = {
        danger: "bg-red-700 hover:bg-red-600 hover:shadow-[0_0_30px_rgba(210,50,50,0.8)] shadow-[0_0_10px_rgba(250,40,40,0.5)] transition hover:font-bold",
        success: "bg-green-600 hover:bg-green-500",
        default: "bg-gray-700 hover:bg-gray-600",
    }
    

    return (createPortal(
        <div
            className="fixed left-0 top-0 w-full h-[100dvh] bg-black/40 not-[]:font-poppins overflow-y-auto pt-6 pb-6"
            onClick={onClose}
        >

        <div 
            className="confirmationModal mx-auto my-6 max-w-[600px] w-10/12 bg-gray-500 rounded-2xl p-6 pb-3 pt-3 shadow-2xl"
            onClick={(e) => {e.stopPropagation()}}
        >
            <hr className="border-gray-400 border-t-4 mb-4" />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center">{title}</h2>
                <hr className="border-gray-400 border-t-1" />
                <p className="text-lg whitespace-pre-line">
                    {description}
                </p>    
                </div>
                <div className="flex flex-col sm:flex-row"> 
                    <button 
                        className={`p-4 sm:p-3 mr-2 w-full rounded-full self-center mb-2 ${confirmStyles[confirmVariant]}`} 
                        onClick={() => {
                            onConfirm?.()
                            onClose()
                        }} 
                    >
                         {confirmText}
                    </button> 
                    <button 
                        className="p-4 sm:p-3 mr-2 w-full bg-gray-700 rounded-full hover:bg-gray-600 transition self-center mb-2" 
                        onClick={onClose} 
                    >
                         {cancelText}
                    </button> 
                </div>
            </div>
            <hr className="border-gray-400 border-t-4 mt-2" />
        </div>
        </div>,
        document.body
    ))
}

export default ConfirmationModal