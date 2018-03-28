import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'

/* tslint:disable:max-line-length */
const TaskItem: React.StatelessComponent<{
  className?: string
  task?: Task
}> = ({ task, className }) => {
  if (!task) {
    return <div>Invalid task</div>
  }
  return (
    <div className={className}>
      <div className="checkbox">
        <svg
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g fillRule="evenodd">
            <path d="M12 21c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9m0-20C5.935 1 1 5.935 1 12s4.935 11 11 11 11-4.935 11-11S18.065 1 12 1" />
            <path d="M15.293 8.793L11 13.086l-2.293-2.293c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l3 3c.195.195.451.293.707.293.256 0 .512-.098.707-.293l5-5c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0" />
          </g>
        </svg>
      </div>
      <div className="content">
        {task.category && <div className="category">{task.category}</div>}
        <div className="title">{task.title}</div>
        {task.description.length > 0 && <p className="description">{task.description}</p>}
      </div>
    </div>
  )
}

export default styled(TaskItem)`
  margin: 12px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  animation: fadeIn 0.4s ease-out;
  display: flex;
  align-items: center;
  .checkbox {
    margin-right: 12px;
    cursor: pointer;
    svg {
      fill: #999;
      display: block;
    }
    svg path:last-child {
      display: none;
    }
    &:hover svg path:last-child {
      display: block;
    }
  }
  .content {
    flex: 1;
  }
  .category {
    opacity: 0.8;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .title {
    font-weight: bold;
    display: inline-block;
  }
  .description {
    font-size: 12px;
    opacity: 0.6;
    margin-top: 8px;
    margin-bottom: 0;
  }
`
