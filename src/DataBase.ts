import Dexie from 'dexie'
import relationships from 'dexie-relationships'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  tagNames?: Array<string>
}

export interface TaskTagInterface {
  id?: number
  taskId: number
  name: string
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>
  taskTags: Dexie.Table<TaskTagInterface, number>

  constructor() {
    super('ease', {
      addons: [relationships]
    })
    this.version(1).stores({
      tasks: `++id, title, category`,
      taskTags: `++id, taskId -> tasks.id, name`
    })
  }

  static async initData() {
    const db = new this()
    const tasks = await db.tasks.toCollection().toArray()
    if (tasks.length < 1) {
      db.tasks.bulkAdd([
        {
          title: 'task',
          category: 'sample/'
        },
        {
          title: 'task2',
          category: 'sample/'
        }
      ])

      db.taskTags.bulkAdd([
        {
          taskId: 1,
          name: 'sample'
        },
        {
          taskId: 1,
          name: 'tag'
        },
        {
          taskId: 2,
          name: 'tag'
        },
        {
          taskId: 2,
          name: 'hoge'
        }
      ])
    }
  }
}

export class Task implements TaskInterface {
  id?: number
  title: string
  category: string
  tagNames?: Array<string>
  taskTags: Array<TaskTagInterface>

  /* tslint:disable */
  static async all() {
    const db = new DataBase()
    const tasks = await db.tasks.toCollection().with({ taskTags: 'taskTags' })
    let results: any = {}

    tasks.forEach((task: Task) => {
      if (task.id) {
        results[task.id] = task
        results[task.id].tags = task.taskTags
      }
    })

    return results
  }

  constructor(title: string, category: string, tagNames: Array<string>) {
    this.title = title
    this.category = category
    this.tagNames = tagNames
    console.log('Init: ', this)
  }

  async save() {
    const db = new DataBase()
    const taskId = await db.tasks.add({ title: this.title, category: this.category })
    console.log('Save Task: ', this)
    if (!this.tagNames) {
      return
    }
    return Promise.all(
      this.tagNames.map((tag: string) => {
        return new TaskTag(taskId, tag).save()
      })
    )
  }
}

export class TaskTag implements TaskTagInterface {
  id?: number
  taskId: number
  name: string

  constructor(taskId: number, name: string) {
    this.taskId = taskId
    this.name = name
  }

  async save() {
    const db = new DataBase()
    return db.taskTags.add({ taskId: this.taskId, name: this.name })
  }
}
