import Dexie from "dexie";

const db = new Dexie('SimpleTodoDB');

db.version(1).stores(
    {
        workspaces: '++id, workspaceId'
    }
)

export default db;