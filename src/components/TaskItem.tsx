import * as React from 'react'
import styled from 'styled-components'
import { Task } from '../DataBase'

const TaskItem: React.StatelessComponent<{
  className?: string
  task?: Task
}> = ({ task, className }) => {
  if (!task) {
    return <div>Invalid task</div>
  }
  return (
    <div className={className}>
      {task.category && <div className="category">{task.category}</div>}
      <div className="title">{task.title}</div>
      {task.description.length > 0 && <p>{task.description}</p>}
    </div>
  )
}

export default styled(TaskItem)`
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
