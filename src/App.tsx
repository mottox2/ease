import * as React from 'react'
import styled from 'styled-components'
import { defineMode } from 'codemirror'
import DataBase, { Task, TaskInterface } from './DataBase'

import Todo from './components/Todo'
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
    todos: Array<TaskInterface>
  }
> {
  state = {
    todos: []
  }

  addTask = (task: Task) => {
    task.save().then(() => {
      this.fetchTask()
    })
  }

  async fetchTask() {
    const tasks = await Task.all()
    this.setState({ todos: Object.keys(tasks).map(k => tasks[k]) })
  }

  async componentWillMount() {
    defineMode('custom', () => {
      return {
        token: (stream: any, state: any) => {
          if (stream.match(/#\w+/)) {
            return 'keyword'
          }
          if (stream.match(/\w+\//)) {
            return 'comment'
          }
          stream.next()
          return null
        }
      }
    })
    DataBase.initData()
    this.fetchTask()
  }

  render() {
    return (
      <Container>
        <Title>Todo List</Title>
        <TaskInput addTask={this.addTask} />
        {this.state.todos.map((todo: TaskInterface, index: number) => (
          <Todo key={index} todo={todo} />
        ))}
      </Container>
    )
  }
}

export default App
