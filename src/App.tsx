import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './components/TaskScreen'
import { Task } from './DataBase'

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
  padding: 16px 16px;
  opacity: 0.88;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #f0f0f0;
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
    categories: []
  }

  async componentWillMount() {
    const categories = await Task.categories()
    console.log(categories)
    this.setState({ categories })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.categories.map(category => {
          if (category === '') { return null }
          return <SidebarItem key={category}>{category}</SidebarItem>
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
