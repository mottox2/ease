import * as React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Pos } from 'codemirror'
import '../utils/codeMirrorCustomMode'
import 'codemirror/addon/hint/show-hint'

import TextareaAutosize from 'react-autosize-textarea'
import { Task } from '../DataBase'

declare global {
  interface Window {
    editor: any
  }
}

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
  task?: Task
  onSubmit: Function
  setHeight?: Function
  categories: Array<string>
}

class TaskInput extends React.Component<Props> {
  state = {
    id: null,
    title: '',
    description: '',
    enabledDescription: false,
    hasFocus: false
  }

  wrapper?: HTMLElement
  editor?: CodeMirror.Editor
  textarea?: HTMLElement

  componentWillMount() {
    const task = this.props.task
    if (task) {
      this.setState({
        id: task.id,
        title: task.category + task.title,
        description: task.description
      })
    }
  }

  componentDidMount() {
    this.setHeight()

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const tagName = document.activeElement.tagName
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return
      }
      if (tagName !== 'TEXTAREA' && this.editor) {
        this.editor.focus()
      }
    })
  }

  setHeight() {
    if (this.wrapper && this.props.setHeight) {
      this.props.setHeight(this.wrapper.offsetHeight)
    }
  }

  addTask() {
    const title = this.state.title.replace(/\w+\//g, '')
    if (title.length < 1) {
      return false
    }
    const newTask = new Task(
      title,
      (this.state.title.match(/\w+\//g) || []).join(''),
      this.state.description,
      { id: this.state.id }
    )
    this.props.onSubmit(newTask)
    this.setState({
      title: '',
      description: '',
      enabledDescription: false
    })
    return true
  }

  isValid() {
    return this.state.title.replace(/\w+\//g, '').length > 0
  }

  /* tslint:disable */
  autocomplete = (cm: any) => {
    const editor: any = this.editor
    if (!editor) return
    const cur = cm.getCursor()
    const end = cur.ch
    const from = Pos(cur.line, 0)
    const to = Pos(cur.line, end)

    const list =
      this.state.title.length < 1
        ? []
        : this.props.categories.filter(
            c => c.indexOf(this.state.title) === 0 && c !== this.state.title
          )

    cm.showHint({
      hint: () => ({
        list,
        from,
        to
      }),
      completeSingle: false
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
        <Wrapper
          style={{
            borderColor: hasFocus ? (this.isValid() ? '#18AA3B' : '#888') : '#ddd'
          }}
        >
          <CodeMirror
            editorDidMount={(editor: CodeMirror.Editor) => {
              this.editor = editor
              window.editor = editor
              editor.setSize(null, editor.defaultTextHeight() + 2 * 4)
            }}
            ref="editor"
            options={{
              mode: 'custom'
            }}
            onKeyDown={(editor: CodeMirror.Editor, e: any) => {
              console.log(editor.state.completionActive)
              const completion = editor.state.completionActive
              if (completion && completion.data.list.length > 0) {
                return true
              }
              if (e.keyCode === KeyCode.ENTER && (e.metaKey || e.ctrlKey || e.shiftKey)) {
                this.setState({ enabledDescription: true })
                if (this.textarea) {
                  this.textarea.focus()
                  e.preventDefault()
                  return false
                }
              }
              if (e.keyCode === KeyCode.ENTER && this.state.title.length > 0) {
                if (this.addTask()) {
                  editor.setValue('')
                }
              }
              return true
            }}
            value={title}
            onBeforeChange={(_editor: CodeMirror.Editor, change: any, value) => {
              const newtext = change.text.join('').replace(/\n/g, '')
              if (change.update) {
                change.update(change.from, change.to, [newtext])
              }
              console.log(change, value)
              // TODO: Unmountする際にsetStateが残りメモリーリークの原因になる可能性がある
              this.setState({ title: value.replace(/\n/g, '') })
              return true
            }}
            onChange={() => {
              this.autocomplete(this.editor)
            }}
            onFocus={() => this.setState({ hasFocus: true })}
            onBlur={() => this.setState({ hasFocus: false })}
          />
          {title.length < 1 && <Placeholder>Category/TaskName</Placeholder>}
          <DescriptionTextarea style={{ display: enabledDescription ? 'block' : 'none' }}>
            <TextareaAutosize
              rows={2}
              onResize={(e: any) => {
                this.setHeight()
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
                    this.setHeight()
                  }
                  return false
                }
                return true
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
