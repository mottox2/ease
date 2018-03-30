import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'

import TaskItem from './TaskItem'
import TaskInput from './TaskInput'

import groupBy from '../utils/groupBy'

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

interface State {
  tasks: Object
  categorizedIds: Map<string, Array<number>>
}

class App extends React.Component<
  {
    currentCategory: string
  },
  State
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

  async fetchTask(path: string = this.props.currentCategory) {
    const tasks = await Task.all(path)
    const groupedTasks = groupBy(
      Object.keys(tasks).map(k => tasks[k]),
      (task: Task) => task.category.split('/')[0]
    )

    groupedTasks.forEach((value: Array<Task>, key: string) => {
      groupedTasks.set(key, groupedTasks.get(key).map((task: Task) => task.id))
    })

    this.setState({
      tasks,
      categorizedIds: groupedTasks
    })
  }

  componentWillMount() {
    this.fetchTask()
  }

  async componentWillReceiveProps(nextProps: any) {
    if (this.props.currentCategory !== nextProps.currentCategory) {
      this.fetchTask(nextProps.currentCategory)
    }
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
      <Main>
        <ScrollArea>
          {Array.from(this.state.categorizedIds).map(([key, taskIds]) => {
            return (
              <React.Fragment key={key}>
                {key === '' ? (
                  <CategoryName style={{ opacity: 0.3 }}>Uncategorized</CategoryName>
                ) : (
                  <CategoryName>{key}</CategoryName>
                )}
                {taskIds.map((taskId: number) => {
                  return <TaskItem key={taskId} task={tasks[taskId]} updateTask={this.updateTask} />
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
