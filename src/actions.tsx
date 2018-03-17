import Dexie from 'dexie'

const getTasks = () => {
  const db = new Dexie('ease')
  db.version(1).stores({
    tasks: `++id, title, category`,
    tags: `++id, name`
  })
}

const saveTask = () => {
  console.log('bb')
}

export default { getTasks, saveTask }
