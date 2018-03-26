import * as React from 'react'
import styled from 'styled-components'

const Todo: React.StatelessComponent<{
  className?: string
  todo?: any
  tags?: any
}> = ({ todo, className, tags }: any) => {
  return (
    <div className={className}>
      {todo.category && <div className="category">{todo.category}</div>}
      <div className="title">{todo.title}</div>
      {todo.tags.map(
        // FIXME: https://github.com/ignasbernotas/dexie-relationships/pull/31 がマージされたら分岐を削除
        (tag: any, i: number) =>
          tag.name.length > 0 ? (
            <div className="tag" key={i}>
              #{tag.name}
            </div>
          ) : null
      )}
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
