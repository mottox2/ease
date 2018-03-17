import * as React from 'react'
import styled from 'styled-components'
import { defineMode } from 'codemirror'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Task, TaskInterface } from './DataBase'

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
    tags: any
  }
> {
  state = {
    value: '',
    todos: [],
    tags: {}
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
    const results = await Task.all()
    const { tasks, tags } = results
    /* tslint:disable */
    console.log(tasks, tags)
    this.setState({
      todos: Object.keys(tasks).map(k => tasks[k]),
      tags
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
                this.state.value.match(/#\w+/g) || []
              )
                .save()
                .then(async () => {
                  console.log('Reload:')
                  /* tslint:disable */
                  const results = await Task.all()
                  const { tasks, tags } = results
                  this.setState({
                    todos: Object.keys(tasks).map(k => tasks[k]),
                    tags,
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
          <Todo key={index} todo={todo} tags={this.state.tags} />
        ))}
      </Container>
    )
  }
}

export default App
