import Dexie from 'dexie'

export interface TaskInterface {
  id?: number
  title: string
  category: string
  tagNames?: Array<string>
  tags?: Array<Tag>
}

export interface TaskTagInterface {
  id?: number
  taskId: number
  tagId: number
  tag?: string
}

export interface TagInterface {
  id?: number
  name: string
}

/* tslint:disable */
export default class DataBase extends Dexie {
  tasks: Dexie.Table<TaskInterface, number>
  tags: Dexie.Table<TagInterface, number>
  task_tags: Dexie.Table<TaskTagInterface, number>

  constructor() {
    super('ease')
    this.version(1).stores({
      tasks: `++id, title, category`,
      tags: `++id, name`,
      task_tags: `++id, task_id, tag_id`
    })
  }
}

export class Task implements TaskInterface {
  id?: number
  title: string
  category: string
  tagNames?: Array<string>
  tags: Array<Tag>

  static all(): Promise<Array<Task>> {
    const db = new DataBase()
    return db.tasks.toCollection().toArray()
  }

  constructor(title: string, category: string, tagNames: Array<string>) {
    this.title = title
    this.category = category
    this.tagNames = tagNames
    console.log(this)
  }

  async save() {
    const db = new DataBase()
    const taskId = await db.tasks.add({ title: this.title, category: this.category })
    if (!this.tagNames) {
      return
    }
    this.tagNames.map((tag: string) => {
      console.log(tag)
      new TaskTag(taskId, tag).save()
    })
  }
}

export class TaskTag implements TaskTagInterface {
  id?: number
  taskId: number
  tagId: number
  tag?: string

  constructor(taskId: number, tag: string) {
    this.taskId = taskId
    this.tag = tag
  }

  async save() {
    const db = new DataBase()
    if (!this.tag) return false
    const tag = await Tag.getOrCreate(this.tag)
    if (!tag.id) return false
    await db.task_tags.add({ taskId: this.taskId, tagId: tag.id })
    return true
  }
}

export class Tag implements TagInterface {
  id?: number
  name: string

  constructor(name: string, id?: number) {
    this.name = name
    this.id = id
  }

  static async getOrCreate(name: string) {
    const db = new DataBase()
    const tag = await db.tags.get({ name })
    if (tag) {
      return new this(tag.name, tag.id)
    }
    let newTag = new this(name)
    const tagId = await newTag.save()
    newTag.id = tagId

    return newTag
  }

  save() {
    const db = new DataBase()
    console.log('save_tag', this.name)
    return db.tags.add({ name: this.name })
  }
}
