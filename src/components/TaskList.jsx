import db from "@/db.js"
import { useLiveQuery } from "dexie-react-hooks";
import Spinner from "@/components/Spinner";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor, MouseSensor } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'

import SortableTask from "@/components/SortableTask";
import { useEffect, useState } from "react";
import { useConfirm } from "@/components/confirm";

const TaskList = ({ workspaceId }) => {
    const tasks = useLiveQuery(
        () => db.tasks.where("workspaceId").equals(workspaceId).toArray(),
        [workspaceId]
    )

    const [visualTasks, setVisualTasks] = useState([])
    useEffect(() => {
        if(!tasks) return 

        const notCompletedTasks = tasks.filter(task => !task.isCompleted)
        setVisualTasks(notCompletedTasks.slice().sort((a, b) => a.order - b.order))
    }, [tasks])

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: { tolerance: 5 },
        }),
        useSensor(PointerSensor, {
            activationConstraint: { tolerance: 5 },
        }),
        useSensor(MouseSensor)
        
    );
    const confirm = useConfirm()

    // Logic and Drag&Drop
    async function toggleTaskCompleted(task) {
        await db.tasks.update(task.id, {
            isCompleted: !task.isCompleted,
            completedAt: Date.now()
        })
    }

    async function deleteTask(task) {
        try {
            await db.tasks.delete(task.id);
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    }
    async function reOrderDatabase(newTasks) {
        try {
            await db.transaction("rw", db.tasks, async () => {
                await db.tasks.bulkPut(
                    newTasks.map((task, index) => ({
                        ...task,
                        order: index
                    }))
                )
            })
        } catch (err) {
            console.error("Tasks order couldn't be update, error: " + err)
        }
    }

    async function onDragEnd(event) {
        const { active, over } = event
        if (!over || active.id === over.id) return;

        // Get current tasks sorted by order
        const sortedTasks = tasks.slice().sort((a, b) => a.order - b.order)

        const oldIndex = sortedTasks.findIndex(t => t.id === active.id)
        const newIndex = sortedTasks.findIndex(t => t.id === over.id)

        const newTasks = arrayMove(sortedTasks, oldIndex, newIndex)

        // Optimistic update
        setVisualTasks(newTasks)

        // Try to update database
        await reOrderDatabase(newTasks)
    }

    // If there is no tasks, show spinner
    if(!tasks) {
        return (
        <Spinner/>
        )
    }

    return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
        <SortableContext
            items={visualTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
        >
            <div className='w-full font-poppins rounded-sm flex flex-col gap-4'>
                { visualTasks.map((task) => (
                    <SortableTask
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompleted}
                        onDelete={deleteTask}
                        isSortable={true}
                    />
                ))}
            </div>
        </SortableContext>
    </DndContext>
    )
}

export default TaskList