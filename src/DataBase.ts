import Dexie from 'dexie'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  description: string
  done: boolean
}

export interface CategoryInterface {
  id?: number
  categoryId: string
  name: string
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>
  categories: Dexie.Table<CategoryInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, category, done`
    })
    this.version(2).stores({
      categories: `++id, categoryId`
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
          done: false
        },
        {
          title: 'Tutorial2',
          category: 'category/',
          description: 'スラッシュ(/)区切りでカテゴリを作ることが出来ます',
          done: false
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
  done: boolean

  /* tslint:disable */
  static async all() {
    const db = new DataBase()
    const tasks = await db.tasks.toCollection().toArray()
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
    console.log('Init: ', this)
  }

  async save() {
    const db = new DataBase()
    await db.tasks.add({
      title: this.title,
      category: this.category,
      description: this.description,
      done: false
    })
    console.log('Save Task: ', this)
  }

  toggleDone(): Task {
    this.done = !this.done
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

export class Category implements CategoryInterface {
  id?: number
  categoryId: string
  name: string

  constructor(id: number, categoryId: string, name: string) {
    this.id = id
    this.categoryId = categoryId
    this.name
  }

  /* tslint:disable */
  static async all() {
    const db = new DataBase()
    const categories = await db.categories.toCollection().toArray()
    let results: any = {}

    categories.forEach((category: Category) => {
      // console.log(task)
      if (category.id) {
        results[category.id] = new this(category.id, category.categoryId, category.name)
      }
    })

    return results
  }
}
