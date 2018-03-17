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

  instance: any

  render() {
    return (
      <Container>
        <Title>Todo List</Title>
        <CodeMirror
          editorDidMount={(editor: any) => {
            this.instance = editor
            this.instance.setSize(null, 40)
            editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
          }}
          autoFocus={true}
          editorWillMount={() => {
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
          }}
          options={{
            mode: 'custom'
          }}
          onKeyDown={(_editor, e: any) => {
            if (e.keyCode === 13 && this.state.value.length > 0) {
              // console.log(this.state.value)
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
          onBeforeChange={(editor, change, value) => {
            // var newtext = change.text.join('').replace(/\n/g, '')
            // change.update(change.from, change.to, [newtext])
            this.setState({ value: value.replace(/\n/g, '') })
            // this.setState({ value: value.replace(/\w+\//g, '') })
            return true
          }}
          onChange={(editor, data, value) => {
            // console.log(editor, data, value)
          }}
        />
        {this.state.todos.map(todo => <Todo key={todo.number} todo={todo} />)}
      </Container>
    )
  }
}

export default App
