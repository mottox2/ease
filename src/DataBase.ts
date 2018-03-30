import Dexie from 'dexie'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  description: string
  done: 0 | 1
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, category, done`
    })
  }

  static async initData() {
    const db = new this()
    const tasks = await db.tasks.toCollection().toArray()
    if (tasks.length < 1) {
      db.tasks.bulkAdd([
        {
          title: 'Tutorial',
          category: '',
          description: 'タスクは完了すると、リロードしたタイミングで削除されます',
          done: 0
        },
        {
          title: 'Tutorial2',
          category: 'category/',
          description: 'スラッシュ(/)区切りでカテゴリを作ることが出来ます',
          done: 0
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
  done: 0 | 1

  /* tslint:disable */
  static async all(path: string = '') {
    const db = new DataBase()
    const tasks = await db.tasks
      .where('category')
      .startsWith(path)
      .toArray()
    let results: any = {}

    tasks.forEach((task: Task) => {
      // console.log(task)
      if (task.id) {
        results[task.id] = new this(task.title, task.category, task.description, {
          id: task.id,
          done: task.done
        })
      }
    })

    return results
  }

  static async categories(): Promise<Array<string>> {
    const db = new DataBase()
    let results: Array<string> = []
    await db.tasks.orderBy('category').uniqueKeys((keys: Array<string>) => {
      results = keys
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

  constructor(title: string, category: string, description: string, options: any = {}) {
    this.title = title
    this.category = category
    this.description = description
    if (options.id) {
      this.id = options.id
      this.done = options.done
    }
    // console.log('Init: ', this)
  }

  async save(): Promise<Task> {
    const db = new DataBase()
    const id = await db.tasks.add({
      title: this.title,
      category: this.category,
      description: this.description,
      done: 0
    })
    this.id = id
    return this
  }

  toggleDone(): Task {
    this.done = this.done === 0 ? 1 : 0
    const db = new DataBase()
    db.tasks.put({
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      done: this.done
    })
    return this
  }
}
