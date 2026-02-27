import Dexie from "dexie";

const db = new Dexie('SimpleTodoDB');

db.version(1).stores(
    {
        workspaces: '++id, name, createdAt, isMain', // & is unique field
        tasks: '++id, workspaceId, title, description, isCompleted, createdAt, completedAt, order'
    }
)

export default db;