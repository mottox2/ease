import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'
const check = require('./check.svg')

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
}> = ({ task, className }) => {
  if (!task) {
    return <div>Invalid task</div>
  }
  return (
    <div className={className}>
      <div className="checkbox">
        <img src={check} />
        <Circle />
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
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      opacity: 0;
      display: block;
    }
    &:hover img {
      opacity: 0.4;
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
