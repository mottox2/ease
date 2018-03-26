import * as React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Task } from '../DataBase'

class TaskInput extends React.Component<{ addTask: Function }> {
  state = {
    value: ''
  }

  render() {
    return (
      <CodeMirror
        editorDidMount={(editor: any) => {
          editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
        }}
        options={{ mode: 'custom' }}
        onKeyDown={(editor, e: any) => {
          if (e.keyCode === 13 && this.state.value.length > 0) {
            const newTask = new Task(
              this.state.value.replace(/#\w+/g, '').replace(/\w+\//g, ''),
              (this.state.value.match(/\w+\//g) || []).join('')
            )
            this.props.addTask(newTask)
            editor.setValue('')
          }
        }}
        value={this.state.value}
        onBeforeChange={(_editor, change: any, value) => {
          const newtext = change.text.join('').replace(/\n/g, '')
          change.update(change.from, change.to, [newtext])
          this.setState({ value: value.replace(/\n/g, '') })
          return true
        }}
      />
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
