import Dexie from 'dexie'
import relationships from 'dexie-relationships'

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
  taskTags: Dexie.Table<TaskTagInterface, number>

  constructor() {
    super('ease', {
      addons: [relationships]
    })
    this.version(1).stores({
      tasks: `++id, title, category`,
      tags: `++id, name`,
      taskTags: `++id, taskId -> tasks.id, tagId -> tags.id`
    })
    // debugger
  }
}

export class Task implements TaskInterface {
  id?: number
  title: string
  category: string
  tagNames?: Array<string>
  tags: Array<Tag>
  taskTags: Array<TaskTagInterface>

  /* tslint:disable */
  static async all() {
    const db = new DataBase()
    const tasks = await db.tasks.toCollection().with({ taskTags: 'taskTags' })
    let results: any = {}

    tasks.forEach((task: Task) => {
      if (task.id) {
        results[task.id] = task
        results[task.id].tagIds = task.taskTags.map(t => t.tagId)
      }
    })
    let tagResults = {}
    ;(await db.tags.toArray()).forEach((tag: any) => (tagResults[tag.id] = tag))

    return {
      tasks: results,
      tags: tagResults
    }
    // const taskTags = await db.task_tags
    //   .where('task_id')
    //   .inAnyRange([tasks[0].id, tasks.splice(-1).id])
    // return {
    //   tasks,
    //   taskTags
    // }
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
    await db.taskTags.add({ taskId: this.taskId, tagId: tag.id })
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
