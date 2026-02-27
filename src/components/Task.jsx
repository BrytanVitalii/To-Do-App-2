import { useEffect, useRef, useState } from "react"
import { FaCheck, FaGripVertical, FaTrash } from "react-icons/fa";

function Task({
  title = "Untitled task",
  description = "No description provided",
  completed = false,
  expanded,
  onToggle,
  onDelete,
  dragHandleProps,
  isDragging,
  isSortable,
}) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if(expanded) {
      setHeight(contentRef.current.scrollHeight)
    } else {
      setHeight(0);
    }
  }, [expanded, isDragging])

  return (
    <>
    <div className={`${completed ? "bg-green-600 border-green-700 " : "bg-gray-600 border-gray-700 "} transition-colors border-4 rounded-xl flex flex-col gap-2`}>
      <div className={`mt-2 flex gap-4 sm:gap-4 items-center pr-4 ${!isSortable && "pl-4"}`}>
      {isSortable && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing touch-none select-none p-3 pr-0 sm:pr-3 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <FaGripVertical className="text-xl" />
        </div>
      )}
      <h2 className="text-2xl grow">{title}</h2>
      </div>
        
      <div 
        style={{height: height}} 
        className={`overflow-hidden ${isDragging ? "transition-none" : "transition-[height] duration-300 ease-in-out"}`}
        >
        <div ref={contentRef} className="pl-4 pr-6 mb-2">
          <p>{description}</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Task
