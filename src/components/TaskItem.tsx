import * as React from 'react'
import styled from 'styled-components'
import linkifyUrls from 'linkify-urls'
import { withState } from 'recompose'
import { Task } from '../DataBase'
import MaterialIcon from './MaterialIcon'
import TaskInput from './TaskInput'

const Circle = styled.div`
  border: 2px solid #ddd;
  border-radius: 20px;
  width: 20px;
  height: 20px;
  transition: background-color 0.1s ease-out;
`
interface WithState {
  isEdit?: boolean
  toggleEdit?: Function
}

interface Props {
  className?: string
  task?: Task
  updateTask?: Function
  deleteTask?: Function
  fetchTask?: Function
}

const TaskItem: React.StatelessComponent<Props & WithState> = ({
  task,
  className,
  updateTask,
  deleteTask,
  isEdit = false,
  toggleEdit,
  fetchTask
}) => {
  if (!task) {
    return <div>Invalid task</div>
  }
  if (isEdit) {
    return (
      <div style={{ marginLeft: '-24px' }}>
        <p
          style={{
            fontSize: '12px',
            color: 'rgb(24, 170, 59)',
            fontWeight: 'bold',
            margin: '0 0 0 20px'
          }}
        >
          Editing: {task.title}
        </p>
        <TaskInput
          task={task}
          onSubmit={(newTask: Task) => {
            if (toggleEdit) {
              newTask.save().then(() => {
                if (fetchTask) {
                  fetchTask()
                }
              })
              toggleEdit(!isEdit)
            }
          }}
          categories={[]}
        />
      </div>
    )
  }
  const displayCategory = task.category.replace(/\w+\//, '')
  return (
    <div className={className}>
      <div
        className={`checkbox ${task.done && 'isDone'}`}
        onClick={() => {
          if (!updateTask) {
            return
          }
          updateTask(task.toggleDone())
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M0 0h18v18H0z" fill="none" />
          <path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z" />
        </svg>
        <Circle
          style={{
            backgroundColor: task.done ? '#18AA3B' : 'inherit',
            borderColor: task.done ? '#18AA3B' : '#ddd'
          }}
        />
      </div>
      <div className="content">
        {displayCategory.length > 0 && <div className="category">{displayCategory}</div>}
        <div className="title">{task.title}</div>
        {task.description.length > 0 && (
          <p
            className="description"
            dangerouslySetInnerHTML={{
              __html: linkifyUrls(task.description, { attributes: { target: '_blank' } })
            }}
          />
        )}
      </div>
      <div className="actions">
        <MaterialIcon
          icon="edit"
          onClick={() => {
            if (toggleEdit) {
              toggleEdit(!isEdit)
            }
          }}
        />
        <MaterialIcon
          onClick={() => {
            if (!deleteTask) {
              return
            }
            deleteTask(task)
          }}
          icon="delete"
        />
      </div>
    </div>
  )
}

const Styled = styled(TaskItem)`
  margin: 12px 0;
  padding-right: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  animation: fadeIn 0.4s ease-out;
  display: flex;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
    border-bottom: 0;
  }
  .checkbox {
    margin-right: 12px;
    cursor: pointer;
    position: relative;
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      opacity: 0;
      display: block;
      transition: opacity 0.08s ease-out;
    }
    &:hover svg {
      opacity: 0.3;
    }
    &.isDone svg {
      opacity: 1;
      fill: white;
    }
  }
  .content {
    flex: 1;
  }
  .category {
    opacity: 0.6;
    font-size: 11px;
    margin-bottom: 2px;
    color: #3c5064;
  }
  .title {
    display: inline-block;
    color: #3c5064;
    font-size: 14px;
  }
  .description {
    color: #3c5064;
    font-size: 11px;
    opacity: 0.6;
    margin-top: 4px;
    margin-bottom: 0;
  }
  .actions {
    display: flex;
  }
  .actions i {
    opacity: 0;
    cursor: pointer;
    margin-left: 8px;
  }
  &:hover {
    .actions i {
      opacity: 0.2;

      &:hover {
        opacity: 0.5;
      }
    }
  }
`

export default withState<Props, boolean, string, string>('isEdit', 'toggleEdit', false)(Styled)
