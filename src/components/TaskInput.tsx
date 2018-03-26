import * as React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { defineMode } from 'codemirror'
import { Task } from '../DataBase'

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
      (this.state.title.match(/\w+\//g) || []).join('')
    )
    this.props.addTask(newTask)
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
        {this.state.enabledDescription && (
          <textarea
            value={this.state.description}
            onChange={(e: any) => this.setState({ description: e.target.value })}
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

export default styled(TaskInput)`
  margin: 12px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  animation: fadeIn 0.4s ease-out;
  .category {
    opacity: 0.8;
    font-size: 12px;
  }
  .title {
    font-weight: bold;
    display: inline-block;
  }
`
