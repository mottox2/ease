import * as React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { defineMode } from 'codemirror'
import TextareaAutosize from 'react-autosize-textarea'
import { Task } from '../DataBase'

enum KeyCode {
  ENTER = 13,
  ESC = 27
}

const Wrapper = styled.div`
  border: 2px solid #ddd;
  border-radius: 4px;
`

const Placeholder = styled.div`
  position: absolute;
  left: 22px;
  top: 23px;
  font-size: 14px;
  opacity: 0.5;
`

const DescriptionTextarea = styled.div`
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    opacity: 0.8;
    font-size: 14px;
    border: 0;
    border-top: 1px solid #ddd;
    display: block;
    resize: none;
    line-height: 1.4;
    &:focus {
      outline: none;
    }
  }
`

interface Props {
  addTask: Function
  setHeight: Function
}

class TaskInput extends React.Component<Props> {
  state = {
    title: '',
    description: '',
    enabledDescription: false,
    hasFocus: false
  }

  wrapper?: HTMLElement
  editor?: HTMLElement
  textarea?: HTMLElement

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

  componentDidMount() {
    if (this.wrapper) {
      this.props.setHeight(this.wrapper.offsetHeight)
    }

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const tagName = document.activeElement.tagName
      if (tagName !== 'TEXTAREA' && this.editor) {
        this.editor.focus()
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

  /* tslint:disable */
  render() {
    const { enabledDescription, title, description, hasFocus } = this.state
    return (
      <div
        style={{ position: 'relative', padding: '12px' }}
        ref={(element: any) => {
          if (element) {
            this.wrapper = element
          }
        }}
      >
        <Wrapper style={{ borderColor: hasFocus ? '#18AA3B' : '#ddd' }}>
          <CodeMirror
            editorDidMount={(editor: any) => {
              this.editor = editor
              editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
            }}
            options={{ mode: 'custom' }}
            onKeyDown={(editor, e: any) => {
              if (e.keyCode === KeyCode.ENTER && (e.metaKey || e.ctrlKey || e.shiftKey)) {
                this.setState({ enabledDescription: true })
                if (this.textarea) {
                  this.textarea.focus()
                  e.preventDefault()
                  return false
                }
              }
              if (e.keyCode === 13 && title.length > 0) {
                this.addTask()
                editor.setValue('')
              }
              return true
            }}
            value={title}
            onBeforeChange={(_editor, change: any, value) => {
              const newtext = change.text.join('').replace(/\n/g, '')
              if (change.update) {
                change.update(change.from, change.to, [newtext])
              }
              this.setState({ title: value.replace(/\n/g, '') })
              return true
            }}
            onFocus={() => this.setState({ hasFocus: true })}
            onBlur={() => this.setState({ hasFocus: false })}
          />
          {title.length < 1 && <Placeholder>Category/TaskName</Placeholder>}
          <DescriptionTextarea style={{ display: enabledDescription ? 'block' : 'none' }}>
            <TextareaAutosize
              rows={2}
              onResize={(e: any) => {
                if (this.wrapper) {
                  this.props.setHeight(this.wrapper.offsetHeight)
                }
              }}
              value={description}
              placeholder="Task description"
              onChange={(e: any) => this.setState({ description: e.target.value })}
              onKeyDown={(e: any) => {
                if (e.keyCode === KeyCode.ENTER) {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) {
                    return true
                  }
                  return this.addTask()
                }
                if (e.keyCode === KeyCode.ESC && description === '') {
                  this.setState({ enabledDescription: false })
                  if (this.editor) {
                    this.editor.focus()
                  }
                  return false
                }
              }}
              ref={(element: any) => {
                if (element) {
                  this.textarea = element.textarea
                }
              }}
              onFocus={() => this.setState({ hasFocus: true })}
              onBlur={() => this.setState({ hasFocus: false })}
            />
          </DescriptionTextarea>
        </Wrapper>
      </div>
    )
  }
}

export default TaskInput
