import { useState } from "react"
import { createPortal } from "react-dom"
import { FaX, FaFloppyDisk } from "react-icons/fa6"
import db from "@/db.js"

const AddTask = ({ open, workspaceId, onClose}) => {
    const [taskName, setTaskName] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [error, setError] = useState("")

    // Dont show if not open
    if(!open) return null

    // Disable scrolling of a page in open
    // NOT IMPLEMENTED

    // Logic
    function checkValid() {
        if(taskName.trim() === "") {
            setError("'Task name' cannot be empty")
            return false
        }
        
        setError("")
        return true
    }

    function cleanUp() {
        setTaskName("")
        setTaskDescription("")
        setError("")
    }

    // Update database, and place new task at the very end, by 'order'
    async function updateDb() {
        try {
            const lastTask = await db.tasks
                .where("workspaceId")
                .equals(workspaceId)
                .sortBy("order")

            const newOrder = lastTask.length ? lastTask[lastTask.length-1].order + 1 : 0

            const id = await db.tasks.add({
                workspaceId,
                title: taskName,
                description: taskDescription,
                isCompleted: false,
                createdAt: new Date(),
                completedAt: -1,
                order: newOrder
            })
            console.log("Added task id:", id)
            console.log("Clearing modal...")
            cleanUp()
        } catch (err) {
            // Temporary, later reporting to <Content> and displaying error
            console.error("Error:", err)
        }
    }

    function handleAdd() {
        if(!checkValid()) return
        updateDb()
        onClose()
    }

    return createPortal(
        <div
            className="fixed left-0 top-0 w-full h-[100dvh] bg-black/40 not-[]:font-poppins overflow-y-auto pt-6 pb-6"
            onClick={onClose}
        >
            <div 
                className="addTask mx-auto my-6 max-w-[600px] w-10/12 bg-gray-500 rounded-2xl p-6 pb-3 pt-3 shadow-2xl"
                onClick={(e) => {e.stopPropagation()}}
            >
                <hr className="border-gray-400 border-t-4 mb-4" />
                <div className="flex flex-row justify-between align-middle text-center" >
                    <div className="text-center self-center ml-2">
                        <h1 className="text-3xl sm:text-4xl font-bold">New task</h1>
                    </div>
                    <button 
                        className="p-4 sm:p-3 mr-2 bg-gray-700 rounded-full hover:bg-gray-600 transition self-center"
                        onClick={onClose}
                    >
                        <FaX className="w-4 h-4"/>
                    </button>
                </div>
                <hr className="border-gray-400 mt-4" />
                <div className="flex flex-col mt-4 gap-4">
                    <div className="flex flex-row gap-2 sm:gap-4 w-full bg-gray-600 p-3 rounded-xl">
                        <h2 className="text-xl sm:text-2xl whitespace-nowrap">Task name: </h2>
                        <input 
                            type="text" 
                            className="text-2xl border-b-2 focus:outline-none w-full" 
                            maxLength={30}
                            value={taskName}
                            onChange={(e) => {setTaskName(e.target.value)}}
                        />
                    </div>
                    <div className="bg-gray-600 p-3 rounded-xl mb-4">
                        <h2 className="text-xl sm:text-2xl whitespace-nowrap mb-2">Task description: </h2>
                        <textarea 
                            className="text-2xl focus:outline-none w-full border p-2 h-64 max-h-[512px] resize-y" 
                            maxLength={250} 
                            value={taskDescription}
                            onChange={(e) => {setTaskDescription(e.target.value)}}
                        />
                    </div>
                </div>
                { error && (
                    <h3 className="errorMessage text-xl text-red-300 text-center drop-shadow-[0_0_6px_rgba(248,50,50,0.5)] mb-4 font-semibold">{error}</h3>
                )}
                <button 
                    className="p-4 sm:p-3 mr-2 w-full bg-gray-700 rounded-full hover:bg-gray-600 transition self-center mb-2"
                    onClick={handleAdd}
                >
                    Add
                </button>
                <hr className="border-gray-400 border-t-4 mt-auto" />
            </div>
        </div>,
        document.body
    )
}


export default AddTask