import Dexie from 'dexie'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  description: string
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, title, category`
    })
  }

  static async initData() {
    const db = new this()
    const tasks = await db.tasks.toCollection().toArray()
    if (tasks.length < 1) {
      db.tasks.bulkAdd([
        {
          title: 'task',
          category: 'sample/',
          description: ''
        },
        {
          title: 'task2',
          category: 'sample/',
          description: ''
        }
      ])
    }
  }
}

export class Task implements TaskInterface {
  id?: number
  title: string
  category: string
  description: string

  /* tslint:disable */
  static async all() {
    const db = new DataBase()
    const tasks = await db.tasks.toCollection().toArray()
    let results: any = {}

    tasks.forEach((task: Task) => {
      if (task.id) {
        results[task.id] = task
      }
    })

    return results
  }

  static async byPath(path: string) {
    const db = new DataBase()
    return await db.tasks
      .where('category')
      .startsWith(path)
      .toArray()
  }

  constructor(title: string, category: string, description: string) {
    this.title = title
    this.category = category
    this.description = description
    console.log('Init: ', this)
  }

  async save() {
    const db = new DataBase()
    await db.tasks.add({
      title: this.title,
      category: this.category,
      description: this.description
    })
    console.log('Save Task: ', this)
  }
}
