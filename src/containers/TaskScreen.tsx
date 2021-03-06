import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'

import TaskItem from '../components/TaskItem'
import TaskInput from '../components/TaskInput'

import groupBy from '../utils/groupBy'
import { Consumer, actions } from '../store'

const CategoryName = styled.div`
  animation: fadeIn 0.4s ease-out;
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
  padding-bottom: 0;
  @media screen and (max-width: 776px) {
    padding-left: 12px;
  }
  overflow-y: auto;
  height: calc(100% - 117px);
  box-sizing: border-box;
`

const InputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
`

interface State {
  tasks: Object
  categorizedIds: Map<string, Array<number>>
  inputHeight: number
}

interface Props {
  currentCategory: string
  refresh: Function
  categories: Array<string>
}

class TaskScreen extends React.Component<Props, State> {
  state = {
    tasks: [],
    categorizedIds: new Map(),
    inputHeight: 0
  }

  // saveTask
  saveTask = (task: Task) => {
    task.save().then(() => {
      this.props.refresh()
      this.fetchTask()
    })
  }

  deleteTask = (task: Task) => {
    task.delete().then(() => {
      this.props.refresh()
      this.fetchTask()
    })
  }

  setHeight = (height: number) => {
    this.setState({ inputHeight: height })
  }

  fetchTask = async (path: string = this.props.currentCategory) => {
    const tasks = await Task.all(path)
    console.log(path, tasks)
    const pathLevel = path.split('/').length - 1
    const groupedTasks = groupBy(
      Object.keys(tasks).map(k => tasks[k]),
      (task: Task) => task.category.split('/')[pathLevel]
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
    console.log(this.props, nextProps)
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
    const { tasks, inputHeight } = this.state
    return (
      <Main>
        <ScrollArea style={{ height: `calc(100% - ${inputHeight}px)` }}>
          {Array.from(this.state.categorizedIds)
            .sort()
            .map(([key, taskIds]) => {
              return (
                <React.Fragment key={key}>
                  {key === '' ? (
                    <CategoryName style={{ opacity: 0.3 }}>Uncategorized</CategoryName>
                  ) : (
                    <CategoryName>{key}</CategoryName>
                  )}
                  {taskIds.map((taskId: number) => {
                    const task: Task = tasks[taskId]
                    /* tslint:disable:curly */
                    if (!task) return null
                    return (
                      <TaskItem
                        key={taskId}
                        task={task}
                        updateTask={this.updateTask}
                        deleteTask={this.deleteTask}
                        saveTask={this.saveTask}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
        </ScrollArea>
        <InputWrapper>
          <TaskInput onSubmit={this.saveTask} setHeight={this.setHeight} />
        </InputWrapper>
      </Main>
    )
  }
}

const TaskScreenWrapper: React.SFC<{}> = (props: {}) => {
  return (
    <Consumer
      mapStateToProps={(state: any) => ({
        currentCategory: state.currentCategory,
        categories: state.categories
      })}
    >
      {({ currentCategory, categories }: any) => (
        <TaskScreen
          currentCategory={currentCategory}
          refresh={actions.loadCategories}
          categories={categories}
        />
      )}
    </Consumer>
  )
}

export default TaskScreenWrapper
