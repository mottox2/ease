import * as React from 'react'
import styled from 'styled-components'
import { defineMode } from 'codemirror'
import { Controlled as CodeMirror } from 'react-codemirror2'

import Todo from './Todo'

const Container = styled.div`
  padding: 16px;
`

const Title = styled.h1`
  font-size: 22px;
`

class App extends React.Component {
  state = {
    value: '',
    todos: [
      {
        number: 1,
        title: 'Initial TODO',
        category: 'default/',
        tags: ['#sample']
      }
    ]
  }

  componentWillMount() {
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
  }

  render() {
    return (
      <Container>
        <Title>Todo List</Title>
        <CodeMirror
          editorDidMount={(editor: any) => {
            editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
          }}
          options={{
            mode: 'custom'
          }}
          onKeyDown={(_editor, e: any) => {
            if (e.keyCode === 13 && this.state.value.length > 0) {
              this.setState({
                todos: [
                  {
                    number: this.state.todos[0].number + 1,
                    tags: this.state.value.match(/#\w+/g) || [],
                    category: (this.state.value.match(/\w+\//g) || []).join(''),
                    title: this.state.value.replace(/#\w+/g, '').replace(/\w+\//g, '')
                  },
                  ...this.state.todos
                ],
                value: ''
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
        {this.state.todos.map(todo => <Todo key={todo.number} todo={todo} />)}
      </Container>
    )
  }
}

export default App
