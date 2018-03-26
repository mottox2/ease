import * as React from 'react'
import styled from 'styled-components'

const Todo: React.StatelessComponent<{
  className?: string
  todo?: any
}> = ({ todo, className, tags }: any) => {
  return (
    <div className={className}>
      {todo.category && <div className="category">{todo.category}</div>}
      <div className="title">{todo.title}</div>
    </div>
  )
}

export default styled(Todo)`
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
