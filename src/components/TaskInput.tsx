import * as React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { defineMode } from 'codemirror'
import { Task } from '../DataBase'

const Placeholder = styled.div`
  position: absolute;
  left: 26px;
  top: 25px;
  font-size: 13px;
  opacity: 0.3;
`

class TaskInput extends React.Component<{ addTask: Function }> {
  state = {
    title: '',
    description: '',
    enabledDescription: false
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

  addTask() {
    const newTask = new Task(
      this.state.title.replace(/#\w+/g, '').replace(/\w+\//g, ''),
      (this.state.title.match(/\w+\//g) || []).join(''),
      this.state.description
    )
    this.props.addTask(newTask)
    this.setState({
      title: '',
      description: '',
      enabledDescription: false
    })
  }

  render() {
    return (
      <React.Fragment>
        <CodeMirror
          editorDidMount={(editor: any) => {
            editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
          }}
          options={{ mode: 'custom' }}
          onKeyDown={(editor, e: any) => {
            if (e.keyCode === 13 && e.metaKey) {
              this.setState({ enabledDescription: true })
              return
            }
            if (e.keyCode === 13 && this.state.title.length > 0) {
              this.addTask()
              editor.setValue('')
            }
          }}
          value={this.state.title}
          onBeforeChange={(_editor, change: any, value) => {
            const newtext = change.text.join('').replace(/\n/g, '')
            change.update(change.from, change.to, [newtext])
            this.setState({ title: value.replace(/\n/g, '') })
            return true
          }}
        />
        {this.state.title.length < 1 && <Placeholder>Category/TaskName</Placeholder>}
        {this.state.enabledDescription && (
          <textarea
            style={{
              width: '100%',
              border: '2px solid #ccc',
              borderTop: 0,
              boxSizing: 'border-box'
            }}
            value={this.state.description}
            onChange={(e: any) => this.setState({ description: e.target.value })}
            onKeyDown={(e: any) => {
              if (e.keyCode === 13 && this.state.description.length > 0) {
                this.addTask()
              }
            }}
            ref={(element: any) => {
              if (element) {
                element.focus()
              }
            }}
          />
        )}
      </React.Fragment>
    )
  }
}

export default TaskInput
