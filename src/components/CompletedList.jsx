import db from "@/db.js"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import SortableTask from "./SortableTask"

const CompletedList = ({ workspaceId }) => {
    const liveTasks = useLiveQuery(
        () => db.tasks.where("workspaceId").equals(workspaceId).toArray(),
        [workspaceId]
    )
    const [expanded, setExpanded] = useState(false)

    const [completedTasks, setCompletedTasks] = useState([])
    useEffect(() => {
        if(!liveTasks) return

        const tasks = liveTasks.filter(task => task.isCompleted)
        setCompletedTasks(tasks.slice().sort((a, b) => b.completedAt - a.completedAt))
    }, [liveTasks])

    // Logic
    async function toggleTaskCompleted(task) {
        await db.tasks.update(task.id, {
            isCompleted: !task.isCompleted
        })
    }

    async function deleteTask(task) {
        try {
            await db.tasks.delete(task.id);
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    }

    return (
        <div className='w-full font-poppins flex flex-col'>
            <div className="flex justify-center">
                <div 
                    className={`underline text-gray-400 hover:text-gray-100 cursor-pointer ${expanded ? "pb-4" : ""}`}
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? "Hide completed tasks" : "Show completed tasks"}
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                { expanded && (completedTasks.map((task) => (
                    <SortableTask
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompleted}
                        onDelete={deleteTask}
                        isSortable={false}
                    />
                )))}
            </div>
        </div>
    )
}

export default CompletedList