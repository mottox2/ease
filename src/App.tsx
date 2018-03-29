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
    background-color: #f0f0f0;
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

class SidebarItems extends React.Component {
  state = {
    categories: new Map()
  }

  async componentWillMount() {
    const categories = await Task.categories()
    this.setState({ categories: groupBy(categories, (c: string) => c.split('/')[0]) })
  }

  render() {
    return (
      <React.Fragment>
        {Array.from(this.state.categories).map(([key, categories]) => {
          if (key === '') {
            return null
          }
          return categories.map((category: string, index: number) => {
            return (
              <SidebarItem key={category} style={{ opacity: index === 0 ? 1 : 0.4 }}>
                {category}
              </SidebarItem>
            )
          })
        })}
      </React.Fragment>
    )
  }
}

const App: React.SFC<{}> = () => (
  <React.Fragment>
    <Header>
      <Title>ease.do</Title>
    </Header>
    <Container>
      <Sidebar>
        <SidebarItem>すべてのタスク</SidebarItem>
        <SidebarItems />
      </Sidebar>
      <TaskScreen />
    </Container>
  </React.Fragment>
)

export default App
