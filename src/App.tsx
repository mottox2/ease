import * as React from 'react'
import styled from 'styled-components'
import { defineMode } from 'codemirror'
import { Controlled as CodeMirror } from 'react-codemirror2'
import DataBase, { Task, TaskInterface } from './DataBase'

import Todo from './Todo'

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
    value: string
  }
> {
  state = {
    value: '',
    todos: []
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
    const tasks = await Task.all()
    /* tslint:disable */
    this.setState({
      todos: Object.keys(tasks).map(k => tasks[k])
    })
  }

  render() {
    return (
      <Container>
        <Title>Todo List</Title>
        <CodeMirror
          editorDidMount={(editor: any) => {
            editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
          }}
          options={{ mode: 'custom' }}
          onKeyDown={(_editor, e: any) => {
            if (e.keyCode === 13 && this.state.value.length > 0) {
              new Task(
                this.state.value.replace(/#\w+/g, '').replace(/\w+\//g, ''),
                (this.state.value.match(/\w+\//g) || []).join(''),
                // FIXME: https://github.com/ignasbernotas/dexie-relationships/pull/31 がマージされたら空Arrayにする
                (this.state.value.match(/#\w+/g) || ['']).map(str => str.replace('#', ''))
              )
                .save()
                .then(async () => {
                  console.log('Reload:')
                  /* tslint:disable */
                  const tasks = await Task.all()
                  this.setState({
                    todos: Object.keys(tasks).map(k => tasks[k]),
                    value: ''
                  })
                })
            }
          }}
          value={this.state.value}
          onBeforeChange={(editor, change: any, value) => {
            const newtext = change.text.join('').replace(/\n/g, '')
            change.update(change.from, change.to, [newtext])
            this.setState({ value: value.replace(/\n/g, '') })
            return true
          }}
        />
        {this.state.todos.map((todo: TaskInterface, index: number) => (
          <Todo key={index} todo={todo} />
        ))}
      </Container>
    )
  }
}

export default App
