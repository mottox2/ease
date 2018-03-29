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
  path: string
  name: string
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>
  categories: Dexie.Table<CategoryInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, category, done`,
      categories: `++id, path`
    })
  }

  static async initData() {
    const db = new this()
    const tasks = await db.tasks.toCollection().toArray()
    if (tasks.length < 1) {
      await new Task(
        'Tutorial1',
        '',
        'タスクは完了すると、リロードしたタイミングで削除されます'
      ).save()
      await new Task(
        'Tutorial',
        'category',
        'スラッシュ(/)区切りでカテゴリを作ることが出来ます'
      ).save()
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
    this.category = (await Category.findOrCreate(this.category)).fullPath()
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
  path: string
  name: string

  constructor(id: number, path: string, name: string) {
    this.id = id
    this.path = path
    this.name = name
  }

  fullPath(): string {
    return [this.path, this.id].filter(v => v).join('/')
  }

  static async all() {
    const db = new DataBase()
    const categories = await db.categories.toCollection().toArray()
    let results: any = {}

    categories.forEach((category: Category) => {
      if (category.id) {
        results[category.id] = new this(category.id, category.path, category.name)
      }
    })

    return results
  }

  /* tslint:disable */
  static async findOrCreate(fullName: string): Promise<Category> {
    const names = fullName.split('/')
    const db = new DataBase()
    const categories = await db.categories.toCollection().toArray()

    const result = await searchChildren(
      {
        path: '',
        id: undefined
      },
      names,
      categories
    )
    // console.log('findOrCreate: ', result)
    return new this(result.id, result.path, result.name)
  }
}

async function searchChildren(
  searchCategory: any,
  names: Array<string>,
  categories: Array<CategoryInterface>
): Promise<any> {
  const searchPath = [searchCategory.path, searchCategory.id].filter(a => a).join('/') // ex. 1
  const searchName = names[0]
  let result = categories.filter(category => category.path === searchPath).find(category => {
    console.log(category, searchName)
    return category.name === searchName
  })
  console.log('search: ', searchPath, result)

  if (!result) {
    result = await createCategory(searchPath, searchName)
  }

  if (names.length === 1) {
    return result
  }
  return searchChildren(result, names.slice(1), categories)
}

async function createCategory(path: string, name: string): Promise<CategoryInterface> {
  const db = new DataBase()
  const newCategory: CategoryInterface = { path, name }
  const resultId = await db.categories.add(newCategory)
  return { ...newCategory, id: resultId }
}
