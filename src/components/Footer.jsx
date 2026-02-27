import { useEffect, useState } from "react"
import { FaEdit, FaPlus } from "react-icons/fa"

function Footer({ onAddWorkspace, onEdit, isInEditMode }) {

  return (
    <div className='standartBlock font-poppins mt-2 mb-8 sm:mt-4 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 justify-center bg-gray-800'>
        <hr className="border-gray-700 border-t-4" />
        <div className="flex flex-col items-center justify-center">
            <div></div>
            <div className="footerControls flex justify-center gap-16 sm:gap-4 mb-2">
                <button 
                    className={`p-4 sm:p-3 ${isInEditMode ? ("bg-blue-900 hover:bg-blue-800") : ("bg-gray-700 hover:bg-gray-600")} rounded-full transition`}
                    onClick={onEdit}
                >
                    <FaEdit className="w-4 h-4"/>
                </button>
                <button 
                    className="p-4 sm:p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                    onClick={onAddWorkspace}
                >
                    <FaPlus className="w-4 h-4"/>
                </button>
            </div>
            <div className="flex">
                <p className="text-gray-700">Made By Vitalii Brytan</p>
            </div>
        </div>
        <hr className="border-gray-700 border-t-4" />
    </div>
  )
}

export default Footer