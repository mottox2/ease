import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './components/TaskScreen'
import { Task } from './DataBase'
import groupBy from './utils/groupBy'

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  height: calc(100% - 60px);
  flex: 1;
  min-width: 100%;
`

const Sidebar = styled.div`
  width: 260px;
  padding: 8px 0;
  @media screen and (max-width: 776px) {
    display: none;
  }
`

const Header = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.06);
  height: 60px;
  position: relative;
  background-color: #315096;
  padding: 0 16px;
  line-height: 60px;
  z-index: 10;
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
  &:hover {
    background-color: #f5f5f5;
  }
  &.isActive,
  &:active {
    background-color: #f0f0f0;
    opacity: 1;
    &:before {
      background-color: #ddd;
    }
  }
  &:before {
    content: ' ';
    display: inline-block;
    background-color: #eee;
    width: 24px;
    height: 24px;
    position: relative;
    top: 8px;
    margin-right: 16px;
    border-radius: 12px;
  }
`

const Title = styled.h1`
  padding-top: 0;
  font-size: 18px;
  color: white;
  margin: 0;
  text-align: center;
  font-family: Lato, sans-serif;
`

class Side extends React.Component<{
  currentCategory: string
  onSelect: Function
  categories: Array<string>
}> {
  state = {
    mapedCategories: new Map()
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.categories.length !== nextProps.categories.length) {
      this.setState({
        mapedCategories: groupBy(nextProps.categories, (c: string) => c.split('/')[0])
      })
    }
  }

  /* tslint:disable */
  render() {
    const { currentCategory, onSelect } = this.props
    return (
      <Sidebar>
        {Array.from(this.state.mapedCategories).map(([key, categories]) => {
          if (categories.length === 0) return null
          const category = categories[0]
          const isOpen = currentCategory.match(category)
          return (
            <React.Fragment key={key}>
              <SidebarItem
                key={category}
                onClick={e => {
                  onSelect(category)
                }}
                className={category === currentCategory ? 'isActive' : ''}
              >
                {key === '' ? 'すべてのタスク' : category}
              </SidebarItem>
              {isOpen &&
                categories.map((category: string, index: number) => {
                  if (index === 0) return null
                  return (
                    <SidebarItem
                      key={category}
                      onClick={e => {
                        onSelect(category)
                      }}
                      className={category === currentCategory ? 'isActive' : ''}
                    >
                      {category}
                    </SidebarItem>
                  )
                })}
            </React.Fragment>
          )
        })}
      </Sidebar>
    )
  }
}

class App extends React.Component {
  state = {
    currentCategory: '',
    categories: []
  }

  selectCategory = (nextCategory: string) => {
    this.setState({ currentCategory: nextCategory })
  }

  async componentWillMount() {
    this.refresh()
  }

  refresh = async () => {
    const categories = await Task.categories()
    this.setState({ categories })
  }

  render() {
    const { currentCategory } = this.state
    return (
      <Container>
        <Side
          currentCategory={currentCategory}
          onSelect={this.selectCategory}
          categories={this.state.categories}
        />
        <TaskScreen currentCategory={currentCategory} refresh={this.refresh} />
      </Container>
    )
  }
}

const Layout: React.SFC<{}> = () => (
  <React.Fragment>
    <Header>
      <Title>ease.do</Title>
    </Header>
    <App />
  </React.Fragment>
)

export default Layout
