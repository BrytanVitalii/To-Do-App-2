import { useEffect, useState, useRef } from 'react';
import '@fontsource/poppins';
import Workspace from '@/components/Workspace.jsx';
import db from "@/db.js"
import AddTask from '@/components/AddTask';
import AddWorkspace from './AddWorkspace';
import Footer from '@/components/footer';
import Spinner from '@/components/Spinner'
import ConfirmationModal from './confirm/ConfirmationModal';
import { useConfirm } from "@/components/confirm";

const Content = () => {
  const [addTaskWorkspaceId, setAddTaskWorkspaceId] = useState(null)
  const [isWorkspaceBeingAdded, setIsWorkspaceBeingAdded] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(true)
  const [isInWorkspaceEditMode, setIsInWorkspaceEditMode] = useState(false)
  const [workspaces, setWorkspaces] = useState([])

  // Logic
  const confirm = useConfirm()

  const addTutorialTasks = async (tutorialWorkspaceId) => {
      await db.tasks.bulkAdd([
        {
          title: "Tap/Click to expand",
          description: "Tap or click a task to expand and collapse it.",
          workspaceId: tutorialWorkspaceId,
          createdAt: Date.now(),
          isCompleted: false,
          completedAt: -1,
          order: 0
        },
        {
          title: "⬆️⬇️ Drag handle Up or Down to reorder",
          description: "Use the handle to drag tasks.",
          workspaceId: tutorialWorkspaceId,
          createdAt: Date.now(),
          isCompleted: false,
          completedAt: -1,
          order: 1
        },
        {
          title: "➡️🗑️ Swipe right to delete",
          description: "Swipe this task right to remove it.",
          workspaceId: tutorialWorkspaceId,
          createdAt: Date.now(),
          isCompleted: false,
          completedAt: -1,
          order: 2
        },
        {
          title: "✅⬅️ Swipe left to complete",
          description: "Try swiping this task to the left and showing completed tasks!",
          workspaceId: tutorialWorkspaceId,
          createdAt: Date.now(),
          isCompleted: false,
          completedAt: -1,
          order: 3
        },
        {
          title: "You can't delete this workspace",
          description: "You can rename this workspace, add more using a button in a footer, but you cant delete this one",
          workspaceId: tutorialWorkspaceId,
          createdAt: Date.now(),
          isCompleted: false,
          completedAt: -1,
          order: 4
        },
      ])
  }

  // Fetch all workspaces check if there are any workspaces, if not, create a default one
  const effectRan = useRef(false)
  useEffect(() => {
    if(effectRan.current) return;
    effectRan.current = true

    const fetchWorkspaces = async () => {
      let workspacesCount = await db.workspaces.count();

      if (workspacesCount === 0) {
        const id = await db.workspaces.add({
          name: 'Default Workspace', 
          createdAt: Date.now(),
          isMain: true
        });

        addTutorialTasks(id)
      }

      const workspaces = await db.workspaces.toCollection().toArray()
      if(workspaces) { setWorkspaces(workspaces) }
    }

    fetchWorkspaces();
  }, []);

  const refetchWorkspaces = async () => {
    const workspaces = await db.workspaces.toArray()
    setWorkspaces(workspaces)
  }

  const deleteWorkspace = (workspace) => {
    if(!workspace) return
    if(workspace.isMain) {
      confirm({
        title: 'Can not delete main workspace',
        description: 'Workspace: "' + workspace.name + '" is a main workspace',
        confirmText: 'Ok',
        cancelText: 'Cancel',
        onConfirm: () => {}
      })
      return
    }

    confirm({
        title: 'Delete this workspace?',
        description: 'Workspace: ' + workspace.name,
        confirmVariant: 'danger',
        confirmText: 'Delete Workspace',
        cancelText: 'Cancel',
        onConfirm: async () => 
        {
          try {
            await db.transaction('rw', db.tasks, db.workspaces, async () => {
              // Delete workspace tasks
              await db.tasks
                .where('workspaceId')
                .equals(workspace.id)
                .delete();
              
              // Delete workspace it self
              await db.workspaces.delete(workspace.id);
              
              // Update workspaces
              refetchWorkspaces()
            })
          } catch (err) {
            console.error("Failed to delete workspace and its tasks, error:", err);
          }
        },
    })
  }

  return (
    <>
    <div id='workspaces' className='flex flex-col mt-2 sm:mt-4 gap-2 sm:gap-4'>
      {workspaces.length > 0 ? (
        // If there are workspaces, display them
        workspaces.map((ws, wsIndex) => (
          <Workspace 
              key={ws.id ?? wsIndex}
              id={ws?.id ?? null} 
              title={ws?.name ?? null}
              onAddTask={() => setAddTaskWorkspaceId(ws?.id ?? null)}
              isInEditMode={isInWorkspaceEditMode}
              onDelete={() => deleteWorkspace(ws)}
              isMain={ws.isMain}
          /> 
        ))
      ) : (
        // Use null workspace for loader. (rare work around)
        <Workspace 
          id={null} 
          title={null}
          onAddTask={() => setAddTaskWorkspaceId(null)}
        /> 
      )}
    </div>

    <Footer
      onAddWorkspace={() => setIsWorkspaceBeingAdded(true)}
      onEdit={() => {setIsInWorkspaceEditMode(prev => !prev)}}
      isInEditMode={isInWorkspaceEditMode}
    />
    
    <AddTask
        open={addTaskWorkspaceId !== null}
        workspaceId={addTaskWorkspaceId}
        onClose={() => setAddTaskWorkspaceId(null)}
    />
    <AddWorkspace
      open={isWorkspaceBeingAdded}
      onClose={() => setIsWorkspaceBeingAdded(false)}
      onWorkspaceAdded={() => refetchWorkspaces()}
    />
    </>
  )
}

export default Content