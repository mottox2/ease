import * as React from 'react'
import styled from 'styled-components'
import DataBase, { Task, Category } from '../DataBase'

import TaskItem from './TaskItem'
import TaskInput from './TaskInput'

const CategoryName = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin: 32px 0 24px;
  color: #3c5064;
  letter-spacing: 0.2px;
  font-family: Lato, sans-serif;
  &:first-child {
    margin-top: 0;
  }
`

const Main = styled.div`
  flex: 1;
  background-color: #fff;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  border-left: 1px solid #eee;
  position: relative;
`

const ScrollArea = styled.div`
  padding: 24px;
  padding-right: 0;
  @media screen and (max-width: 776px) {
    padding-left: 12px;
  }
  overflow-y: auto;
  height: calc(100% - 48px - 30px);
`

const InputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 12px;
`

function groupBy(list: Array<any>, keyGetter: Function) {
  const map = new Map()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

class App extends React.Component<
  {},
  {
    tasks: Object
    categories: Object
    categorizedIds: Map<string, Array<number | string>>
  }
> {
  state = {
    tasks: [],
    categories: [],
    categorizedIds: new Map()
  }

  addTask = (task: Task) => {
    task.save().then(() => {
      this.fetchTask()
    })
  }

  async fetchTask() {
    const tasks = await Task.all()
    const categories = await Category.all()
    const groupedTasks = groupBy(
      Object.keys(tasks).map(k => tasks[k]),
      (task: Task) => task.category
    )

    // Normalize category
    groupedTasks.forEach((value: Array<Task>, key: string) => {
      const categoryTree = key.split('/').filter(v => v) // => ['rootCategory', 'sub']
      if (categoryTree.length > 1) {
        const rootCategory = categoryTree[0]
        if (!groupedTasks.get(rootCategory)) {
          groupedTasks.set(rootCategory, [])
        }
        groupedTasks.set(rootCategory, groupedTasks.get(rootCategory).concat(value))
        groupedTasks.delete(key)
      }
    })

    groupedTasks.forEach((value: Array<Task>, key: string) => {
      groupedTasks.set(key, groupedTasks.get(key).map((task: Task) => task.id))
    })

    console.log(groupedTasks)
    console.log(tasks)
    this.setState({
      tasks,
      categories,
      categorizedIds: groupedTasks
    })
  }

  async componentWillMount() {
    await DataBase.initData()
    this.fetchTask()
  }

  updateTask = (newTask: Task) => {
    let tasks: Object = { ...this.state.tasks }
    if (!newTask.id) {
      return
    }
    tasks[newTask.id] = newTask
    this.setState({ tasks })
  }

  render() {
    const { categories, tasks } = this.state
    return (
      <Main>
        <ScrollArea>
          {Array.from(this.state.categorizedIds).map(([key, taskIds]) => {
            const category: Category = this.state.categories[key]
            console.log(categories, category)
            return (
              <React.Fragment key={key}>
                {category.name === '' ? (
                  <CategoryName style={{ opacity: 0.3 }}>Uncategorized</CategoryName>
                ) : (
                  <CategoryName>{category.name}</CategoryName>
                )}
                {taskIds.map((taskId: number) => {
                  const task: Task = tasks[taskId]
                  return (
                    <TaskItem
                      key={taskId}
                      task={task}
                      categories={task.category
                        .split('/')
                        .map(categoryId => this.state.categories[categoryId])}
                      updateTask={this.updateTask}
                    />
                  )
                })}
              </React.Fragment>
            )
          })}
        </ScrollArea>
        <InputWrapper>
          <TaskInput addTask={this.addTask} />
        </InputWrapper>
      </Main>
    )
  }
}

export default App
