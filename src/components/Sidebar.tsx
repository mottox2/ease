import * as React from 'react'
import styled from 'styled-components'
import groupBy from '../utils/groupBy'
import MaterialIcon from '../components/MaterialIcon'
import { Consumer, actions } from '../store'

const Sidebar = styled.div`
  width: 260px;
  padding: 8px 0;
  @media screen and (max-width: 776px) {
    display: none;
  }
`

const SidebarItem = styled.div`
  color: #3c5064;
  padding: 0 16px;
  opacity: 0.88;
  font-size: 14px;
  line-height: 48px;
  cursor: pointer;
  font-family: Lato, sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f5f5f5;
  }
  &.isActive,
  &:active {
    background-color: #f0f0f0;
    opacity: 1;
    i {
      opacity: 0.6;
    }
  }
  i {
    opacity: 0.3;
  }
`

class Side extends React.Component<{}> {
  /* tslint:disable */
  render() {
    return (
      <Consumer
        mapStateToProps={(state: any) => ({
          categories: state.categories,
          currentCategory: state.currentCategory
        })}
      >
        {({ categories, currentCategory }: any) => (
          <Sidebar>
            {Array.from(groupBy(categories, (c: string) => c.split('/')[0])).map(
              ([key, categories]) => {
                if (categories.length === 0) return null
                const category = categories[0]
                const isOpen = currentCategory.match(category)
                return (
                  <React.Fragment key={key}>
                    <SidebarItem
                      key={category}
                      onClick={e => {
                        actions.setCategory(category)
                      }}
                      className={category === currentCategory ? 'isActive' : ''}
                    >
                      <MaterialIcon icon="folder" style={{ marginRight: 12 }} />
                      {key === '' ? 'すべてのタスク' : category}
                    </SidebarItem>
                    {isOpen &&
                      categories.map((category: string, index: number) => {
                        if (index === 0) return null
                        return (
                          <SidebarItem
                            key={category}
                            onClick={e => {
                              actions.setCategory(category)
                            }}
                            className={category === currentCategory ? 'isActive' : ''}
                          >
                            <MaterialIcon icon="chevron_right" style={{ marginRight: 12 }} />
                            {category}
                          </SidebarItem>
                        )
                      })}
                  </React.Fragment>
                )
              }
            )}
          </Sidebar>
        )}
      </Consumer>
    )
  }
}

export default Side
