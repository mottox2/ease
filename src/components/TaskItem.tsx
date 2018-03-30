import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'
import MaterialIcon from './MaterialIcon'

const Circle = styled.div`
  border: 2px solid #ddd;
  border-radius: 20px;
  width: 20px;
  height: 20px;
`

/* tslint:disable:max-line-length */
const TaskItem: React.StatelessComponent<{
  className?: string
  task?: Task
  updateTask?: Function
}> = ({ task, className, updateTask }) => {
  if (!task) {
    return <div>Invalid task</div>
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
        {task.description.length > 0 && <p className="description">{task.description}</p>}
      </div>
      <div className="actions">
        {/* <MaterialIcon icon="edit" style={{ top: 1 }} /> */}
        <MaterialIcon icon="delete" style={{ top: 1 }} />
      </div>
    </div>
  )
}

export default styled(TaskItem)`
  margin: 12px 0;
  padding-right: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  animation: fadeIn 0.4s ease-out;
  display: flex;
  align-items: center;
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
    }
    &:hover svg {
      opacity: 0.4;
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
      opacity: 0.3;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`
