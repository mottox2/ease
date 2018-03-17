import Dexie from 'dexie'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  tags?: Array<TagInterface> | Array<string>
}

export interface TagInterface {
  id?: number
  name: string
}

export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>
  tags: Dexie.Table<TagInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, title, category`,
      tags: `++id, name`
    })
  }
}

export class Task implements TaskInterface {
  id?: number
  title: string
  category: string
  tags?: Array<TagInterface>

  // static async all(): Dexie.Collection<TaskInterface, number> {
  static all(): Promise<any> {
    const db = new DataBase()
    return db.tasks.toCollection().toArray()
  }

  constructor(title: string, category: string, tags: Array<string>) {
    this.title = title
    this.category = category
  }

  save() {
    const db = new DataBase()
    db.tasks
      .add({
        title: this.title,
        category: this.category
      })
      .then(() => {
        console.log('SAVED!!')
      })
  }
}

export class Tag implements TagInterface {
  id?: number
  name: string

  constructor(name: string) {
    this.name = name
  }

  save() {
    const db = new DataBase()
    db.tags
      .add({
        name: this.name
      })
      .then(() => {
        console.log('SAVED!!')
      })
  }
}
