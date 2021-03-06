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
}

export const initializeData = async () => {
  const db = new DataBase()
  const taskCount = await db.tasks.count()
  if (taskCount < 1) {
    db.tasks.bulkAdd([
      {
        title: 'easeはPCに特化した、簡単にタスクを追加できるToDoリストです。',
        category: '',
        description: '雑にカテゴリを切ってタスクを作れます。',
        done: 0
      },
      {
        title: 'タスクの説明文を簡単に入力できる！',
        category: '',
        description: 'タスク作成欄でShift-Enterを押すと説明文を追加できます。',
        done: 0
      },
      {
        title: 'スラッシュ区切りでカテゴリに！',
        category: 'category/',
        description: 'スラッシュ(/)区切りでカテゴリを作ることが出来ます',
        done: 0
      },
      {
        title: 'カテゴリは階層を深くできる！',
        category: 'category/nested',
        description: '2階層以上も同じようにタスクを作れます。',
        done: 0
      }
    ])
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
    if (this.id) {
      await db.tasks.put({
        id: this.id,
        title: this.title,
        category: this.category,
        description: this.description,
        done: this.done
      })
    } else {
      const id = await db.tasks.add({
        title: this.title,
        category: this.category,
        description: this.description,
        done: 0
      })
      this.id = id
    }
    return this
  }

  async delete(): Promise<boolean> {
    const db = new DataBase()
    if (!this.id) return false
    await db.tasks.delete(this.id)
    return true
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
