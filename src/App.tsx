import * as React from 'react'
import styled from 'styled-components'
import DataBase, { Task } from './DataBase'

import TaskItem from './components/TaskItem'
import TaskInput from './components/TaskInput'

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  height: calc(100% - 60px);
  flex: 1;
  min-width: 100%;
`

const Sidebar = styled.div`
  width: 260px;
  padding: 24px;
`

const Header = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.06);
  height: 60px;
  position: relative;
  background-color: #315096;
  padding: 0 16px;
  line-height: 60px;
`

const SidebarItem = styled.div`
  padding: 12px 12px;
  opacity: 0.88;
  font-size: 15px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #f0f0f0;
  }
  small {
    margin-left: 4px;
    font-family: Helvetica, sans-serif;
    opacity: 0.66;
  }
`

const Main = styled.div`
  flex: 1;
  background-color: #fff;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  padding: 40px;
  border-left: 1px solid #eee;
`

const Title = styled.h1`
  padding-top: 0;
  font-size: 15px;
  color: white;
  margin: 0;
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
    taskIds: Array<string | number>
  }
> {
  state = {
    tasks: [],
    taskIds: []
  }

  addTask = (task: Task) => {
    task.save().then(() => {
      this.fetchTask()
    })
  }

  async fetchTask() {
    const tasks = await Task.all()
    const groupedTasks = groupBy(
      Object.keys(tasks).map(k => tasks[k]),
      (task: Task) => task.category
    )

    groupedTasks.forEach((value: Array<Task>, key: string) => {
      const categoryTree = key.split('/') // => ['rootCategory', '']
      console.log(categoryTree)
      if (categoryTree.length > 2) {
        const rootCategory = categoryTree[0] + '/'
        groupedTasks.set(rootCategory, groupedTasks.get(rootCategory).concat(value))
        groupedTasks.delete(key)
      }
    })

    console.log(groupedTasks)
    console.log(tasks)
    this.setState({
      taskIds: Object.keys(tasks),
      tasks
    })
  }

  async componentWillMount() {
    DataBase.initData()
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
    const { tasks, taskIds } = this.state
    return (
      <React.Fragment>
        <Header>
          <Title>ease.do</Title>
        </Header>
        <Container>
          <Sidebar>
            <SidebarItem>
              すべてのタスク<small>{tasks.length}</small>
            </SidebarItem>
          </Sidebar>
          <Main>
            <TaskInput addTask={this.addTask} />
            {taskIds.map((taskId: number, index: number) => (
              <TaskItem key={index} task={tasks[taskId]} updateTask={this.updateTask} />
            ))}
          </Main>
        </Container>
      </React.Fragment>
    )
  }
}

export default App
