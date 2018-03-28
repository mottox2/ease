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

const CategoryName = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin: 32px 0 24px;
  color: #3c5064;
  letter-spacing: 0.4px;
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
    categorizedIds: Map<string, Array<number | string>>
  }
> {
  state = {
    tasks: [],
    categorizedIds: new Map()
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

    // Normalize category
    groupedTasks.forEach((value: Array<Task>, key: string) => {
      const categoryTree = key.split('/') // => ['rootCategory', '']
      if (categoryTree.length > 2) {
        const rootCategory = categoryTree[0] + '/'
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
      categorizedIds: groupedTasks
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
    const { tasks } = this.state
    return (
      <React.Fragment>
        <Header>
          <Title>ease.do</Title>
        </Header>
        <Container>
          <Sidebar>
            <SidebarItem>すべてのタスク</SidebarItem>
          </Sidebar>
          <Main>
            <TaskInput addTask={this.addTask} />
            {Array.from(this.state.categorizedIds).map(([key, taskIds]) => {
              return (
                <div key={key}>
                  {key === '' ? (
                    <CategoryName style={{ opacity: 0.3 }}>Uncategorized/</CategoryName>
                  ) : (
                    <CategoryName>{key}</CategoryName>
                  )}
                  {taskIds.map((taskId: number) => {
                    return (
                      <TaskItem key={taskId} task={tasks[taskId]} updateTask={this.updateTask} />
                    )
                  })}
                </div>
              )
            })}
          </Main>
        </Container>
      </React.Fragment>
    )
  }
}

export default App
