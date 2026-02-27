import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Task from "@/components/Task"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { CgMoreVerticalR } from "react-icons/cg"
import { FaCheck, FaCheckCircle, FaCheckSquare, FaTrash, FaUndo, FaUndoAlt } from "react-icons/fa"
import { FaCross, FaTrashArrowUp } from "react-icons/fa6"

const SWIPE_THRESHOLD = 90
const SWIPE_MAX = 110

const SortableTask = ({ task, onToggle, onDelete, isSortable }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

    const [swipeX, setSwipeX] = useState(0)
    const [isSwiping, setIsSwiping] = useState(false)
    const [expanded, setExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const [changeLeftSwipeSymbol, setChangeLeftSwipeSymbol] = useState(false)
    useEffect(() => {
        let timeout

        if(task.isCompleted !== changeLeftSwipeSymbol) {
            timeout = setTimeout(() => {
                setChangeLeftSwipeSymbol(task.isCompleted)
            }, 185)
        }
        
        return () => clearTimeout(timeout)
    }, [task.isCompleted])

    const pointerIdRef = useRef(null)
    const startXRef = useRef(0)
    const startYRef = useRef(0)
    const movedRef = useRef(false)
    const suppressClickRef = useRef(false)

    const style = {
        transform: CSS.Translate.toString(transform),
        transition
    }

    const clamp = (v, min, max) => Math.min(Math.max(v,min), max)

    const resetSwipe = () => {
        setSwipeX(0)
        setIsSwiping(false)
        pointerIdRef.current = null
        movedRef.current = false
    }

    // Logic
    const handlePointerDown = (e) => {
        if (isDragging) return
        if (e.button != null && e.button !== 0) return

        pointerIdRef.current = e.pointerId
        startXRef.current = e.clientX
        startYRef.current = e.clientY
        movedRef.current = false
        suppressClickRef.current = false
        setIsSwiping(true)
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
        if(pointerIdRef.current !== e.pointerId) return

        const dx = e.clientX - startXRef.current
        const dy = e.clientY - startYRef.current

        if (!movedRef.current) {
            if(Math.abs(dx) < 6 && Math.abs(dy) < 6) return

            if(Math.abs(dy) > Math.abs(dx)) {
                resetSwipe()
                return
            }
        }

        movedRef.current = true
        suppressClickRef.current = Math.abs(dx) > 8

        e.preventDefault()

        setSwipeX(clamp(dx, -SWIPE_MAX, SWIPE_MAX))
    }

    const handlePointerUp = (e) => {
        if(pointerIdRef.current !== e.pointerId) return

        const dx = e.clientX - startXRef.current
        const clampedX = clamp(dx, -SWIPE_MAX, SWIPE_MAX)

        const isSwipe = Math.abs(clampedX) >= SWIPE_THRESHOLD
        const isTap =
            Math.abs(dx) < 6 && !isDragging

        if(isSwipe) {
            suppressClickRef.current = true
            if(clampedX > 0) {
                setIsDeleting(true)

                // Trigger deleting from a DB after animation finishes
                setTimeout(() => {
                    onDelete(task)
                }, 250)
            }
            else {
                setIsCompleting(true)

                // Trigger completing a task  after animation finishes
                setTimeout(() => {
                    onToggle(task)
                }, 250)
            }
        } else if(isTap) {
            setExpanded(prev => !prev)
        }

        resetSwipe()
    }

    const handlePointerCancel = (e) => {
        if(pointerIdRef.current !== e.pointerId) return
        resetSwipe()
    }

    const handleClickCapture = (e) => {
        if(suppressClickRef.current) {
            e.preventDefault()
            e.stopPropagation()
            suppressClickRef.current = false
        }
    }

    // Swipe Style
    const swipeStyle = {
        transform: isDeleting 
                   ? `translateX(120%)`
                   : isCompleting 
                     ? `translateX(-120%)`
                     : `translateX(${swipeX}px)`,
        transition: isDeleting
                   ? 'transform 240ms ease' 
                   : isSwiping ? "none" : "transform 180ms ease",
        touchAction: "pan-y",
        willChange: "transform"
    }

    return (
        <div
            ref={setNodeRef}
            style={style} 
            {...attributes}
            onClickCapture={handleClickCapture}
            className="relative overflow-x-hidden"
        >
            {(!isDeleting && !isCompleting) && (
            <div className="absolute inset-1 rounded-xl bg-gray-700 flex justify-between items-center pl-5 pr-5">
                <div className={`text-3xl ${Math.abs(swipeX) >= SWIPE_THRESHOLD ? "text-red-500 drop-shadow-[0_0_15px_rgba(255,40,40,1.0)]" : "text-red-600 drop-shadow-[0_0_5px_rgba(25,40,40,0.3)]"}`}>
                    {Math.abs(swipeX) >= SWIPE_THRESHOLD ? <FaTrashArrowUp/> : <FaTrash/>}
                </div>
                { changeLeftSwipeSymbol ? (
                <div className={`text-3xl ${Math.abs(swipeX) >= SWIPE_THRESHOLD ? "text-red-500 drop-shadow-[0_0_15px_rgba(255,40,40,0.5)]" : "text-red-600 drop-shadow-[0_0_5px_rgba(25,40,40,0.3)]"}`}>
                    {Math.abs(swipeX) >= SWIPE_THRESHOLD ? <FaUndoAlt/> : <FaUndoAlt/>}
                </div>
                ) : (
                <div className={`text-3xl ${Math.abs(swipeX) >= SWIPE_THRESHOLD ? "text-green-400 drop-shadow-[0_0_15px_rgba(40,255,40,1.0)]" : "text-green-500 drop-shadow-[0_0_5px_rgba(4,40,4,0.3)]"}`}>
                    {Math.abs(swipeX) >= SWIPE_THRESHOLD ? <FaCheckSquare/> : <FaCheckSquare/>}
                </div>
                ) }
            </div>
            )}
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                style={swipeStyle}
                className={`relative ${isSwiping ? "select-none" : ""}`}
            >
                <div>
                    <Task
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        completed={task.isCompleted}
                        expanded={expanded}
                        onToggle={() => onToggle(task)}
                        onDelete={() => onDelete(task)}
                        dragHandleProps={listeners}
                        isDragging={isDragging}
                        isSortable={isSortable}
                    />
                </div>
            </div>
        </div>
    )
}

export default SortableTask