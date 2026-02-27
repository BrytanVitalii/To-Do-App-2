import { useDeferredValue, useEffect, useState } from 'react'
import TaskList from '@/components/TaskList'
import { FaPlus, FaEdit, FaChevronUp, FaChevronDown, FaGripHorizontal, FaGripVertical, FaTrash } from 'react-icons/fa'
import ContentLoader from "react-content-loader"
import AddTask from '@/components/AddTask'
import Spinner from "@/components/Spinner";
import db from "@/db.js"
import CompletedList from '@/components/CompletedList'

const Workspace = ({id, title = "Workspace ID:" + id, onAddTask, isInEditMode, onDelete, isMain}) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const [workspaceTitle, setWorkspaceTitle] = useState(title)
  useEffect(() => {
    setWorkspaceTitle(title);
  }, [title])
  
  // Should activate deletion and D&D
  const [editMode, setEditMode] = useState(false)
  useEffect(() => {
    setEditMode(isInEditMode)
  }, [isInEditMode])

  // Logic
  async function updateTitle(newTitle) {
    // Optimistic Update
    setWorkspaceTitle(newTitle)
    
    await db.workspaces.update(id, {
      name: newTitle
    })
  }

  // If no workspace, id === null, return loader
  if(id === null) {
    // FANCY LOADING, DEPRECATED
    /*
    return (
    <div className='standartBlock font-poppins mt-2 sm:mt-4 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 justify-center bg-gray-800'>
      <hr className="border-gray-700 border-t-4" />
      <ContentLoader 
        speed={2}
        width={1441-32}
        height={320}
        backgroundColor="#5f6277"
        foregroundColor="#1e2939"
      >
        <rect x={1441/2 - 150} y="10" rx="5" ry="5" width="270" height="20" />
        <rect x="8" y="125" rx="5" ry="5" width={1441-48} height="50" />
        <rect x="8" y="198" rx="5" ry="5" width={1441-48} height="50" />
        <rect x="8" y="271" rx="5" ry="5" width={1441-48} height="50" />
      </ContentLoader>
      <hr className="border-gray-700 border-t-4" />
    </div>
    )
    */

  return (
    <div className='standartBlock font-poppins mt-2 sm:mt-4 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 justify-center bg-gray-800 h-40'>
      <Spinner/>
    </div>
    );
  }

  // Return workspace
  return (
    <>
     <div className='standartBlock font-poppins p-4 bg-gray-800 rounded-2xl shadow-2xl flex flex-row items-stretch gap-2 sm:gap-4'>
      { editMode && (
        false && ( // Handle for rearranging workspaces, not implemented
          <>
          <div className='flex items-center justify-center text-4xl'>
            <FaGripVertical/>
          </div>
          </>
        )
      )}
      <div className='flex flex-col gap-4 justify-center flex-1 min-w-0'>
        <hr className="border-gray-700 border-t-4" />
        {isRenaming ? (
          <input 
            autoFocus
            className='text-center text-2xl border-b-2 focus:outline-none self-center'
            value={workspaceTitle}
            onChange={(e) => setWorkspaceTitle(e.target.value)}
            onBlur={(e) => {
              setIsRenaming(false)
              updateTitle(e.target.value)
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter") {
                setIsRenaming(false)
                updateTitle(e.target.value)
              }
            }}
          />
        ) : (
          <div className='relative flex items-center justify-center'>
            <h3 className='text-2xl text-center max-w-[220px] sm:max-w-none mx-auto'>{workspaceTitle}</h3>
            { editMode ? (
            <div className='absolute right-0 flex items-center justify-center'>
              <button 
                className='text-2xl'
                onClick={onDelete}
              >
                <FaTrash className={
                `${isMain ? 
                "text-gray-700 hover:text-gray-500 hover:drop-shadow-[0_0_5px_rgba(100,100,100,0.8)]" : 
                "text-red-600 hover:text-red-500 hover:drop-shadow-[0_0_5px_rgba(255,40,40,0.8)]"} 
                drop-shadow-[0_0_5px_rgba(25,40,40,0.3)]`}

                />
              </button>
            </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
      <div className='workspaceControls flex justify-center gap-8 sm:gap-4 mb-2'>
        <button 
          className="p-4 sm:p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition self-end"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? (
            <FaChevronDown className="w-4 h-4"/>
          ) : (
            <FaChevronUp className="w-4 h-4"/>
          )}
        </button>
        <button 
          className={`p-4 sm:p-3 ${isRenaming ? ("bg-blue-900 hover:bg-blue-800") : ("bg-gray-700 hover:bg-gray-600")} rounded-full transition`}
          onClick={() => setIsRenaming(true)}
        >
          <FaEdit className="w-4 h-4"/>
        </button>
        <button 
          className="p-4 sm:p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
          onClick={onAddTask}
        >
          <FaPlus className="w-4 h-4"/>
        </button>
        </div>
        {isMinimized ? (
          <>
          <hr className="border-gray-700" />
          <h1 className="flex justify-center align-middle text-center text-4xl">···</h1>
          <hr className="border-gray-700 border-t-4" />
          </>
        ) : (
          <>
          <hr className="border-gray-700" />
          <TaskList workspaceId={id} />
          <hr className="border-gray-700" />
          <CompletedList workspaceId={id}/>
          <hr className="border-gray-700 border-t-4" />
          </>
        )}
      </div>
    </div>
    </>
  )
}

export default Workspace