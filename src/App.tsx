import * as React from 'react'
import styled from 'styled-components'
import DataBase, { Task, TaskInterface } from './DataBase'

import TaskItem from './components/TaskItem'
import TaskInput from './components/TaskInput'

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
`

const Sidebar = styled.div`
  width: 260px;
  padding: 40px;
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
  width: 600px;
  background-color: #fff;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  padding: 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
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
    const { tasks } = this.state
    return (
      <Container>
        <Sidebar>
          <SidebarItem>
            すべてのタスク<small>{tasks.length}</small>
          </SidebarItem>
        </Sidebar>
        <Main>
          <Title>Ease Todo</Title>
          <TaskInput addTask={this.addTask} />
          {tasks.map((task: Task, index: number) => <TaskItem key={index} task={task} />)}
        </Main>
      </Container>
    )
  }
}

export default App
