import * as React from 'react'
import styled from 'styled-components'
import DataBase, { Task, TaskInterface } from './DataBase'

import TaskItem from './components/TaskItem'
import TaskInput from './components/TaskInput'

const Container = styled.div`
  padding: 16px;
`

const Title = styled.h1`
  font-size: 22px;
`

class App extends React.Component<
  {},
  {
    tasks: Array<TaskInterface>
  }
> {
  state = {
    tasks: []
  }

  addTask = (task: Task) => {
    task.save().then(() => {
      this.fetchTask()
    })
  }

  async fetchTask() {
    const tasks = await Task.all()
    this.setState({ tasks: Object.keys(tasks).map(k => tasks[k]) })
  }

  async componentWillMount() {
    DataBase.initData()
    this.fetchTask()
  }

  render() {
    return (
      <Container>
        <Title>Todo List</Title>
        <TaskInput addTask={this.addTask} />
        {this.state.tasks.map((task: Task, index: number) => <TaskItem key={index} task={task} />)}
      </Container>
    )
  }
}

export default App
