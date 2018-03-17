import * as React from 'react'
import styled from 'styled-components'

const Todo: React.StatelessComponent<{
  className?: string
  todo?: any
  tags?: any
}> = ({ todo, className, tags }: any) => {
  const targetTags = todo.tagIds.map((id: number) => tags[id])
  console.log(targetTags)
  return (
    <div className={className}>
      {JSON.stringify(todo)}
      {todo.category && <div className="category">{todo.category}</div>}
      <div className="title">{todo.title}</div>
      {targetTags.map((tag: any, i: number) => (
        <div className="tag" key={i}>
          {tag.name}
        </div>
      ))}
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

  .tag {
    display: inline-block;
    font-size: 12px;
    /* background-color: #ddd; */
    border-radius: 2px;
    margin-right: 4px;
    /* padding: 3px 6px; */
    &:before {
      content: ' ';
      margin-left: 4px;
    }
  }
`