import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './components/TaskScreen'
import { Task } from './DataBase'
import groupBy from './utils/groupBy'
import MaterialIcon from './components/MaterialIcon'
import { actions, getState, Provider, Consumer } from './store'

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
    const { onSelect } = this.props
    return (
      <Sidebar>
        <Consumer
          mapStateToProps={(state: any) => ({
            categories: state.categories,
            currentCategory: state.currentCategory
          })}
        >
          {({ categories, currentCategory }: any) => (
            <>
              {console.log(categories, currentCategory)}
              {Array.from(groupBy(categories, (c: string) => c.split('/')[0])).map(
                ([key, categories]) => {
                  console.log(categories, currentCategory)
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
                                onSelect(category)
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
            </>
          )}
        </Consumer>
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
    actions.setCategory(nextCategory)
  }

  async componentWillMount() {
    this.refresh()
  }

  /* tslint:disable */
  refresh = async () => {
    const categories = await Task.categories()
    actions.setCategories(categories)
    // actions.setCategory('')
    console.log(getState())
    this.setState({ categories })
  }

  render() {
    const { currentCategory, categories } = this.state
    return (
      <Container>
        <Provider>
          <Side
            currentCategory={currentCategory}
            onSelect={this.selectCategory}
            categories={categories}
          />
          <TaskScreen
            currentCategory={currentCategory}
            refresh={this.refresh}
            categories={categories}
          />
        </Provider>
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
